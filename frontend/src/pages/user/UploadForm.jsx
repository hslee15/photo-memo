import React from 'react'
import './style/UploadForm.scss'

const UploadForm = () => {
  return (
    <section className='am-backdrop'>
      <form className="am-panel Upload-form">
        <header>
        <h2>파일 업로드</h2>
        <p className='sub'>이미지와 간단한 메모를 함께 업로드하세요.</p>
        </header>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="title">제목</label>
            <input 
              id='title'
              type='text'
              placeholder='제목을 입력하세요'
            />
          </div>
          <div className="field">
            <label htmlFor="content">내용</label>
            <textarea
              id='content'
              placeholder='간단한 설명을 적어주세요.'
              row={3}
            />
          </div>
          <div className="field">
            <div className="file-row">
              <input
                type="file"
                accept='image/*'
              />
            </div>
          </div>
        </div>
        <div className="actions">
          <button className='btn ghots'>취소</button>
          <button className='btn primary'>업로드</button>
        </div>
      </form>
    </section>
  )
}

export default UploadForm