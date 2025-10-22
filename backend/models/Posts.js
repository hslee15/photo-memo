const mongoose=require('mongoose')

const postSchema=new mongoose.Schema(
    {
        Number :{
            type:Number,
            requried:true,
        },
        title :{
            type:String,
            requried:true,
            trim:true
        },
        content :{
            type:String,
            requried:true,
            trim:true
        },
        fileUrl :{
            type:[String],
            trim:true
        },
        viewLogs:[
            {
                ip:String,
                userAgent:String,
                timestamp:{
                    type:Date,
                    default:Date.now
                }
            }
        ],
        createdAt:{
            type:Date,
            default:Date.now
        },
        updated:{
            type:Date,
            default:Date.now
        }

    },
    {
        timestamps:true
    }
)

const Post=mongoose.model("POST", postSchema)

module.exports=Post