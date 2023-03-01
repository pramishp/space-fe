import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../Context/AuthContext'

function FileUpload() {
  const { authTokens } = useContext(AuthContext)
  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState([])

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }
  const uploadFile = async () => {
    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      const response = await fetch('http://127.0.0.1:8000/app/file-upload/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  const getFiles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/app/file-list/', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      })
      const data = await response.json()
      console.log('data of file list', data)
      setFiles(data)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getFiles()
  }, [])
  const handleFormSubmit = async (event) => {
    event.preventDefault()
    await uploadFile()
    getFiles()
  }
  console.log(files.length)

  return (
    <div>
      <div>
        <form onSubmit={handleFormSubmit}>
          <input type='file' onChange={handleFileChange} />
          <button type='submit'>Upload</button>
        </form>
      </div>
      <div>
        {files.length > 0 ? (
          <ul>
            {files.map((file) => {
              return (
                <li key={file.id}>
                  <a href={file.url}>{file.original_filename}</a>
                </li>
              )
            })}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default FileUpload
