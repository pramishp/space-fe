import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../Context/AuthContext'

function FileUpload() {
  const { user } = useContext(AuthContext)
  const [selectedFiles, setSelectedFiles] = useState([])

  const [fileUrls, setFileUrls] = useState([])

  const handleFileChange = (event) => {
    const files = event.target.files
    setSelectedFiles(files)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('userName', user.username)
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i])
    }
    axios
      .post('http://localhost:8000/app/upload/', formData, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((response) => {
        setFileUrls(response.data.fileUrls)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type='file' multiple onChange={handleFileChange} />
      <button type='submit'>Upload</button>
      {fileUrls.map((url, index) => (
        <div key={index}>
          <a href={url} target='_blank' rel='noreferrer'>
            {url}
          </a>
        </div>
      ))}
    </form>
  )
}

export default FileUpload
