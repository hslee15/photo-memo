const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Post = require('../models/Posts')
const audit= require('../middlewares/audit')
const {authenticateToken}=require('../middlewares/auth');
const {requireRole}=require('../middlewares/roles')

router.get('/stats', 
    authenticateToken,
    requireRole('admin'),
    async(req, res)=>{
        const [today, pending, reports]=await Promise.all([
            Post.countDocuments({
                createdAt:{$gte:new Date(new Date().setHours(0,0,0,0))}
            }),
            Post.countDocuments({status:"pending"}),
            Post.aggregate([
                {$group:{_id:null, sum:{$sum:"$reportsCount"}}}
            ])
        ])
        res.json({today,pending,reports:reports?.[0]?.sum??0})
    }
)

router.get('/posts', authenticateToken, requireRole('admin'),
    async(req,res)=>{
        const {page=1,size=20,status,q}=req.query

        const filter={}
        if(status) filter.status=status
        if(q) filter.title={$regex:q, $options:'i'}
        const items=await Post.find(filter)
        .sort({updatedAt:-1})
        .skip((+page -1)* +size)
        .limit(+size)
        .select('title user status fileUrl updatedAt')

        res.json(items)
    }
)

router.get(
    "/posts",
    authenticateToken,
    requireRole("admin"),
    async (req, res) => {
        try {
        const { page = 1, size = 20, status, q, user, userId } = req.query;

        //  안전 정규화 (trim/소문자)
        const _status = String(status ?? "").trim().toLowerCase();
        const _q = String(q ?? "").trim();

        // 🟩 user 입력값 정리: user 또는 userId 중 하나, trim 필요
        const uidRaw = (user ?? userId ?? "").toString().trim();

        // 🟩 필터 조립을 $and로 (추가 조건과 충돌 방지)
        const and = [];

        // status 필터
        if (_status) {
            if (_status === "pending") {
            and.push({
                $or: [
                { status: "pending" },
                { status: { $exists: false } },
                { status: { $regex: /^pending$/i } },
                ],
            });
            } else {
            and.push({ status: _status });
            }
        }

        // 제목 검색
        if (_q) and.push({ title: { $regex: _q, $options: "i" } });

        // 🟩 작성자 필터 (ObjectId만 허용 버전)
        if (uidRaw) {
            if (!mongoose.isValidObjectId(uidRaw)) {
            return res.status(400).json({ message: "잘못된 userId 형식" });
            }
            and.push({ user: new mongoose.Types.ObjectId(uidRaw) });
        }

        const filter = and.length ? { $and: and } : {};

        const items = await Post.find(filter)
            .sort({ updatedAt: -1 })
            .skip((Number(page) - 1) * Number(size))
            .limit(Number(size))
            .select("title user status fileUrl updatedAt");

        return res.json(items);
        } catch (err) {
        console.error("[ADMIN /posts] error", err);
        return res.status(500).json({ message: "서버 오류", error: err.message });
        }
    }
);


router.patch('/posts/:id',
    authenticateToken,
    requireRole('admin'),
    audit({
        resource:"post",
        action:"update",
        getTargetId:(req)=>req.params.id
    }),
    async(req,res)=>{

const updates=Object.fromEntries(
    Object.entries(req.body).filter(([,v])=>v!==undefined)
);

const updated=await Post.findByIdAndUpdate(req.params.id,updates,{
        new: true
        })

        if(!updated) return res.status(404).json({message:'게시물 없음'})

        res.json(updated);
    }
)

router.patch('/users/:id',
    authenticateToken,
    requireRole('admin'),
    audit({
        resource:'user',
        action:'update',
        getTargetId:(req)=>req.params.id
    }),
    async(req,res)=>{
        const {role, isActive, resetRock}=req.body

        const updates={}

        if(role) updates.role=role

        if(typeof isActive=='boolean') updates.isActive=isActive

        if(resetRock){
            updates.failedLoginAttempts=0
            updates.lastLoginAttempts=null
        }
        const user=await User.findByIdAndUpdate(req.params.id,updates,{
            new:true
        })

        if(!user) return res.status(404).json({message:'사용자 없음'})
            res.json(user)
    }
)

module.exports=router
