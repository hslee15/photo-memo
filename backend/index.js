require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const passport = require('./config/passport')

// authRoutes
const authRoutes=require("./routes/authroutes")
const uploadRoutes=require('./routes/upload')
const postRoutes = require('./routes/posts')
const adminRoutes = require('./routes/admin')



const app = express();
const PORT = process.env.PORT||3000


app.use(cors({
  origin: process.env.FRONT_ORIGIN,              // 변경됨: .env 기반 오리진 설정
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'], // 추가됨: 허용 메서드 명시
  allowedHeaders: ['Content-Type', 'Authorization'] // 추가됨: 허용 헤더 명시
}));

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(passport.initialize())
