import React from 'react'
import FileList from './FileList'
import UploadForm from './UploadForm'
import './style/UserDashboard.scss'
import { useState } from 'react'
import {uploadToS3} from '../../api/postApi'
import { usePosts } from '../../hooks/usePosts'

const UserDashboard = () => {
    const [search,setSearch]=useState("")
    const [open, setOpen]=useState(false)

    const {items, laoding, load, add}=usePosts()

    const handleUploaded=async({items, content, file})=>{
        try {
            const key=file? await uploadToS3(file):null
            console.log('s3 ok!',key)
            
            const created=await add({title, content, fileKeys:key? [key]:[]})
            console.log('db ok!',created)
        } catch (error) {
            console.error('uploaded fail',error)
        }
    }

    return (
        <section>
            <div className="inner">
                <div className="search-wrap">
                    <input type="text" 
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder='검색어를 입력해주세요' />
                    <button 
                    className='btn primary'
                    onClick={()=>setOpen(true)}
                    >업로드</button>
                </div>
            </div>
            <div className="inner">
                {open && (
                    <UploadForm 
                    onUploaded={handleUploaded}
                    open={open} 
                    onClose={()=>setOpen(false)}/>
                )}
                <FileList/>
            </div>
        </section>
    )
}

export default UserDashboard