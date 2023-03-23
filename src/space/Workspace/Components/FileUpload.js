import { UploadFileOutlined } from '@mui/icons-material'
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../Context/AuthContext'
import axios from 'axios'

function FileUpload({onModelUpload}) {
  const { authTokens } = useContext(AuthContext)
  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState([])
  //const [uploadProgress, setUploadProgress] = useState()
  const [uploadingFile, setUploadingFile] = useState(false)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }
  const handleFileClick = (url) => {
    console.log(url)
    onModelUpload(url)
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
        //   onUploadProgress: (progressEvent) => {
        //     const percentCompleted = Math.round(
        //       (progressEvent.loaded * 100) / progressEvent.total
        //     )
        //     setUploadProgress(percentCompleted)
        //   },
        }
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
    //setUploadingFile(false)
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
    console.log('form submitted')
    //setUploadingFile(true)
    setUploadingFile(true)
    await uploadFile()
    setUploadingFile(false)
    getFiles()
  }
  console.log(files.length)
  
  return (
    <div className='mt-4'>
      <div className='bg-white rounded-md shadow-md p-4'>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor='file-upload' className='cursor-pointer'>
          <input
            className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-indigo-400 bg-indigo-500 bg-clip-padding px-3 py-1.5 text-base font-normal text-indigo-800 outline-none transition duration-300 ease-in-out file:-mx-3 file:-my-1.5 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-indigo-100 file:px-3 file:py-1.5 file:text-indigo-800 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-indigo-200 focus:border-indigo-500 focus:bg-indigo-300 focus:text-indigo-800 focus:shadow-[0_0_0_1px] focus:shadow-indigo focus:outline-none dark:bg-transparent dark:text-indigo-300 dark:focus:bg-transparent"
            type="file"
            onChange={handleFileChange}
          />
            <button
              type='submit'
              className='bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 mt-2 rounded-md flex items-center justify-center'
            >
              <UploadFileOutlined className='mr-2' i />
              Upload
            </button>
          </label>
        </form>
        {files.length > 0 && (
                <>
                {uploadingFile && 
                <div>
                Uploadng...
            </div>}
                    
                    <div className='w-full rounded-sm p-4'>
                        {files.map((file) => (
                            <div key={file.id}
                                 className='w-full rounded-lg p-2 flex flex-row items-center justify-between hover:bg-gray-300'>
                                <div className='mr-4 flex-shrink-0 text-sm '>{file.original_filename}</div>
                                <div className='flex items-center justify-between'>
                                    <a
                                        onClick={() => handleFileClick(file.url)}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='block cursor-pointer text-sm text-indigo-500 hover:text-indigo-700 ml-4'
                                    >

                                        <i className="fa fa-insert"></i>Insert
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </>

            )}
      </div>
    </div>
  )
}

export default FileUpload