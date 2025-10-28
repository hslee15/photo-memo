import api from "./client";


const uploadToS3=async(File)=>{

    const {
        data:{url, key}
    }=await api.post('/api/upload/presign',{
        filename:file.name,
        contentType:file.type
    })

    const putRes=await fetch(url,{
        method:'PUT',
        headers:{"Content-Type":file.type},
        body:file
    })

    if(!putRes.ok) throw new Error('S3 업로드 실패')

    return key
}

export const createPost=async({title, content, fileKeys})=>{
    const {data}=await api.post('/api/posts',{
        title,
        content,
        fileUrl:fileKeys
    })

    return data
}