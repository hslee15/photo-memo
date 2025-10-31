import React, { useState, useRef, useEffect } from 'react'
import "./style/UploadForm.scss"
import { usePosts } from '../../hooks/usePosts'
import { uploadToS3 } from '../../api/postApi'
import { urlToKey } from '../../util/urlToKey'
import { toPublicUrl } from '../../util/toPublicUrl'
const UploadForm = ({initial,onClose}) => {
  const [add, update, load]=usePosts()

  const isEdit=!!initial?.id

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    content: initial?.content ?? "",
    file: null,
    preview: null
  })

  const [uploading, setUploading] = useState(false);
  const panelRef = useRef(null);

  useEffect(()=>{
    if(!initail) return 
      const row=Array.isArray(initial.fileUrl)
            ? initial.fileUrl[0]
            : initial?.fileUrl;

      const firstUrl=row? toPublicUrl(raw) :null

      if(firstUrl) setForm((p)=>({...p,preview}))
  },[initial]);

  useEffect(()=>{
    return()=>{
      if(form.preview && form.preview.startsWith("blob:")){
        URL.revokeObjectURL(form.preview)
      }
    }
  },[form.preview])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (form.preview) URL.revokeObjectURL(form.preview)
    const previewUrl = URL.createObjectURL(file)

    setForm((prev) => ({ ...prev, file, preview: previewUrl }))


  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {

      alert('제목을 입력하세요')
      return
    }
    if (uploading) return

    try {
      setUploading(true)

      const uploaded=form.file? await uploadToS3(form.file) :null

      const newKey=uploaded? urlToKey(uploaded):null
      if(isEdit){
        const patch = {
          title: form.title.trim(),
          content: form.content.trim(),
          ...(newKey? {fileUrl:[newKey]} : {}),
        }
        await update(initail._id,patch)
        await load()
        
      }else{
        await add({
          title: form.title.trim(),
          content: form.content.trim(),
          fileKeys: newKey? [newKey] : [],
        })
        await load()
      }



      if (form.preview && form.preview.startsWith('Blob:')){
        URL.revokeObjectURL(form.preview)
      } 

      setForm({
        title: "",
        content: "",
        file: null,
        preview: null
      })

      onClose(false);
    } catch (error) {

      console.error('submit error', error)
    } finally {
      setUploading(false)
    }

  }
  return (
    <section className='am-backdrop'>
      <form
        ref={panelRef}
        onSubmit={handleSubmit}
        className='am-panel Upload-form'>
        <header>
          <h2>파일 업로드</h2>
          <p className="sub">이미지와 간단한 메모를 함께 업로드 하세요</p>
        </header>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="title">제목</label>
            <input
              id='title'
              type="text"
              name='title'
              value={form.title}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }}
              placeholder='제목을 입력하세요' />
          </div>
          <div className="field">
            <label htmlFor="content">내용</label>
            <textarea
              id='content'
              name='content'
              value={form.content}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }}
              placeholder='간단한 설명을 적어주세요'
              rows={3}
            />
          </div>
          <div className="field">
            <div className="file-row">
              <input
                accept='image/*'
                type="file"
                name='file'
                onChange={handleFileChange}
              />
              {form.preview && (
                <div className='preview-wrap'>
                  <img src={form.preview} alt="미리보기" className='preview-thumb' />
                  <p className="file-name">{form.file?.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="btn ghost">취소</button>
          <button
            type='submit'
            disabled={uploading}
            
            className="btn primary">
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default UploadForm