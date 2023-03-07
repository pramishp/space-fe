import { useState } from 'react'
import Sidebar from './Components/Sidebar.js'
import SearchModel from './Components/SearchModel.js'
import FileUpload from './Components/FileUpload.js'
import MenuBar from '../Editor/components/MenuBar'
function Menu({ onModelUpload }) {
    const [modelView, setModelView] = useState(false)
    const [optionsView, setOptionsView] = useState(false)

    const handleOptionsClick = (e) => {
        e.stopPropagation()
        console.log('called')
        setOptionsView((prevState) => !prevState)
        modelView && setModelView((prevState) => !prevState)
    }

    const handleModelsClick = (e) => {
        e.stopPropagation()
        console.log('also called')
        setModelView((prevState) => !prevState)
        optionsView && setOptionsView((prevState) => !prevState)
    }
    const handleModelUpload = (url) => {
        console.log(url)
        onModelUpload(url)
    }

    return (
        <div className='flex flex-row'>
            <Sidebar
                handleModelsClick={handleModelsClick}
                handleOptionsClick={handleOptionsClick}
            />
            {modelView && (
                <div className='flex flex-col items-center  w-1/6 min-h-screen bg-indigo-200'>
                    <div className='w-5/6 max-w-lg'>
                        <SearchModel onModelUpload={handleModelUpload} />
                        <FileUpload />
                    </div>
                </div>
            )}
            {optionsView &&
                <div className='flex flex-col items-center  w-1/6 min-h-screen bg-indigo-200'>
                    <div className='w-5/6 max-w-lg'>
                        <MenuBar />
                    </div>
                </div>
            }
        </div>
    )
}

export default Menu
