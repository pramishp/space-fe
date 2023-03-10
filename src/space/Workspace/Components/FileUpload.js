import {UploadFileOutlined} from '@mui/icons-material'
import React, {useContext, useEffect, useRef, useState} from 'react'
import AuthContext from '../Context/AuthContext'
import axios from 'axios'

function FileUpload({onModelUpload}) {
    const {authTokens} = useContext(AuthContext)
    const [selectedFile, setSelectedFile] = useState(null)
    const [files, setFiles] = useState([])
    const [uploadProgress, setUploadProgress] = useState()
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

    const inputRef = useRef()

    async function onFileUploadButtonClick() {
        if (inputRef && inputRef.current) {
            inputRef.current.click();
            await handleFormSubmit();
        }
    }

    return (
        <div className='mt-4'>
            <form onSubmit={handleFormSubmit}>
                <div className="card">
                    <h3>Upload Files</h3>
                    <div className="drop_box">
                        <header>
                            <h4>Select File here</h4>
                        </header>
                        <p>Files Supported: GLTF, GLB</p>
                        <input
                            ref={inputRef}
                            style={{display: 'none'}}
                            id={"fileInput"}
                            type="file"
                            onChange={handleFileChange}
                        />
                        <button className="btn" onClick={() => onFileUploadButtonClick()}>Choose File</button>
                    </div>
                </div>
            </form>
            {files.length > 0 && (
                <>
                    <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {uploadingFile && (
                            <div className='relative pt-1'>
                                <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200'>
                                    <div
                                        style={{width: `${uploadProgress}%`}}
                                        className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500'
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
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
    )
}

export default FileUpload
