import { UploadFileOutlined } from '@mui/icons-material'
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../Context/AuthContext'
import axios from 'axios'

function FileUpload() {
  const { authTokens } = useContext(AuthContext)
  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState()
  const [uploadingFile, setUploadingFile] = useState(false)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }
  const uploadFile = async () => {
    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/app/file-upload/',
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + String(authTokens.access),
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setUploadProgress(percentCompleted)
          },
        }
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
    setUploadingFile(false)
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
    setUploadingFile(true)
    await uploadFile()
    getFiles()
  }
  console.log(files.length)

  return (
    <div className='mt-4'>
      <div className='bg-white rounded-md shadow-md p-4'>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor='file-upload' className='cursor-pointer'>
            <input
              id='file-upload'
              type='file'
              onChange={handleFileChange}
            />
            <button
              type='submit'
              className='bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center'
            >
              <UploadFileOutlined className='mr-2' i />
              Upload
            </button>
          </label>
        </form>
        {files.length > 0 && (
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {uploadingFile && (
              <div className='relative pt-1'>
                <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200'>
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500'
                  ></div>
                </div>
              </div>
            )}
            {files.map((file) => (
              <div key={file.id} className='bg-gray-100 rounded-md p-4'>
                <div className='font-bold'>{file.original_filename}</div>
                <div className='flex items-center justify-center mt-4'>
                  <a
                    href={file.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-indigo-500 hover:text-indigo-700'
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUpload
