import { useState } from 'react'
import axios from 'axios'


const FileUpload = () => {
  const [files, setFiles] = useState([])
  const [fileInfos, setFileInfos] = useState([])

  const handleFileSelect = (event) => {
    setFiles(Array.from(event.target.files))
  }
  const handleFileUpload = () => {
    const formData = new FormData()
    files.forEach((file) => formData.append('file', file))

    fetch('http://localhost:8000/app/file-upload/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setFileInfos(data)
      })
  }
  const handleViewFile = ({ fileId }) => {
    window.open(`http://localhost:8000/app/file-display/${fileId}/`)
  }
  return (
    <div className='h-screen w-1/6 bg-slate-800'>
      <input type='file' onChange={handleFileSelect} />
      <button onClick={handleFileUpload}>Upload</button>
      {fileInfos.length > 0 && (
        <ul>
          {fileInfos.map((fileInfo) => (
            <li key={fileInfo.id}>
              <button onClick={() => handleViewFile({ fileId: fileInfo.id })}>
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileUpload
