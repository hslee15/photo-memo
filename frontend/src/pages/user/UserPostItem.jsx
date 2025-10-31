import React,{useMemo,useState} from 'react'
import { toPublicUrl } from '../../util/toPublicUrl'
import { formatYMD } from '../../util/formatYMD'
import { usePosts } from '../../hooks/usePosts'
import UploadForm from './UploadForm'
import './style/UserPostList.scss'

const UserPostItem = ({item={}}) => {
    const {remove}=usePosts()
    const [UploadOpen, setUploadOpen]=useState(false)

    const files=useMemo(()=>{
        const row=Array.isArray(item.fileUrl)
        ?item.fileUrl
        :item?.fileUrl
        ? [item.fileUrl]
        :[]
        
        return row.map(toPublicUrl).filter(Boolean)
    },[item])
    
    const title=item?.title ?? '제목 없음'
    const content=item?.content ?? '';
    const number=item?.number
    const updatedAt=item?.updatedAt || item?.createdAt
    const when=formatYMD(updatedAt);

return (
    <div className='inner post-card'>
        <div className="file-card-head">
            {(item?.number?? "")!=="" && (
                <span>No. {number}</span>
            )}
            <h3>{title}</h3>
        </div>
        <div className="file-card-meta">
            {item?.updateAt && (
                <time className='file-card-time'>{when}</time>
            )}
        </div>
        <div className="file-card-details">
            {item?.content && (
                <p className='file-card-content'>{content}</p>
            )}
            {files?.length>0 && (
                <div className='file-card-image'>
                    {files.map((src, idx)=>(
                        <img key={idx} src={src} alt={`file-${idx}`} className='file-card-image'/>
                    ))}
                </div>
            )}
        </div>
        <div className="file-actions">
            <button className='btn secondary'
            onClick={()=>setUploadOpen(true)}
            >
                수정하기
            </button>
            <button className='btn danger'
            onClick={()=>remove(item._id)}
            >삭제하기</button>
        </div>
        {UploadOpen &&(
            <UploadForm 
            onClose={setUploadOpen}
            initail={item}/>
        )}
    </div>
    )
}

export default UserPostItem