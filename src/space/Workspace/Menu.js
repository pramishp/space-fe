import { useState } from 'react'
import Sidebar from './Components/Sidebar.js'
import SearchModel from './Components/SearchModel.js'
import FileUpload from './Components/FileUpload.js'
function Menu({onModelUpload}) {
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
  const handleModelUpload = (url) => {
    console.log(url)
    onModelUpload(url)
  }

  return (
    <div className='flex flex-row'>
      <Sidebar
        handleModelsClick={handleModelsClick}
        handleUploadClick={handleUploadClick}
      />
      {modelView && <SearchModel onModelUpload={handleModelUpload}/>}
      {uploadView && <FileUpload onModelUpload={onModelUpload}/>}
    </div>
  )
}

export default Menu
