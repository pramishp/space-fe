import { useState } from 'react'
import Sidebar from './Components/Sidebar.js'
import SearchModel from './Components/SearchModel.js'
import FileUpload from './Components/FileUpload.js'
import MenuBar from '../Editor/components/MenuBar'
import AnimationMenu from '../Editor/components/AnimationEditor/AnimationMenu.js'
function Menu({ onModelUpload, onLightSelected, onMeshSelected, onGroupSelected, onBackgroundSelected, isXR, selectedItems, enterAnimationMode, onClick , onHoverOnAnimation, onSelectOnAnimation, onUnhoverOnAnimation }) {
    const [modelView, setModelView] = useState(false)
    const [optionsView, setOptionsView] = useState(false)
    const [animationsView, setAnimationsView] = useState(false)

    const handleOptionsClick = (e) => {
        e.stopPropagation()
        setOptionsView((prevState) => !prevState)
        modelView && setModelView((prevState) => !prevState)
        animationsView && setAnimationsView((prevState) => !prevState)
    }

    const handleModelsClick = (e) => {
        e.stopPropagation()
        setModelView((prevState) => !prevState)
        optionsView && setOptionsView((prevState) => !prevState)
        animationsView && setAnimationsView((prevState) => !prevState)
    }
    
    const handleAnimationsClick = (e) => {
        e.stopPropagation()
        setAnimationsView((prevState) => !prevState)
        modelView && setModelView((prevState) => !prevState)
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
                handleAnimationsClick={handleAnimationsClick}
            />
            {modelView && (
                <div className='flex flex-col items-center  w-1/5 min-h-screen bg-indigo-200'>
                    <div className='w-5/6 max-w-lg'>
                        <SearchModel onModelUpload={handleModelUpload} />
                        <FileUpload onModelUpload={handleModelUpload} />
                    </div>
                </div>
            )}
            {optionsView &&
                <div className='flex flex-col items-center  w-1/5 min-h-screen bg-indigo-200'>
                    <div className='w-5/6 max-w-lg'>
                    <MenuBar onLightSelected={onLightSelected}
                                 onMeshSelected={onMeshSelected}
                                 onGroupSelected={onGroupSelected}
                                 onBackgroundSelected={onBackgroundSelected}
                                 isXR={false}
                        />
                    </div>
                </div>
            }
            {animationsView &&
                <div className='flex flex-col items-center  w-1/5 min-h-screen bg-indigo-200'>
                    <div className='w-5/6 max-w-lg'>
                        <AnimationMenu isXR={isXR}
                            selectedItems={selectedItems}
                        enterAnimationMode={enterAnimationMode}
                    onClick={onClick}
                    onHoverOnAnimation={onHoverOnAnimation}
                    onSelectOnAnimation={onSelectOnAnimation}
                    onUnhoverOnAnimation={onUnhoverOnAnimation}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default Menu
