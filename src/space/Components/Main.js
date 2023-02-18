import { useState } from 'react'
import Sidebar from './Sidebar.js'
import SearchModel from './SearchModel.js'
import FileUpload from './FileUpload.js'
function Main() {
  const [modelView, setModelView] = useState(false)
  const [uploadView, setUploadView] = useState(false)

  const handleUploadClick = () => {
    setUploadView((prevState) => !prevState)
    modelView && setModelView((prevState) => !prevState)
  }
  const handleModelsClick = () => {
    setModelView((prevState) => !prevState)
    uploadView && setUploadView((prevState) => !prevState)
  }

  return (
    <div className='flex flex-row'>
      <Sidebar
        handleModelsClick={handleModelsClick}
        handleUploadClick={handleUploadClick}
      />
      {modelView && <SearchModel />}
      {uploadView && <FileUpload />}
    </div>
  )
}

export default Main
