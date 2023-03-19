import { useEffect, useState } from 'react'
import Sidebar from './Components/Sidebar.js'
import SearchModel from './Components/SearchModel.js'
import FileUpload from './Components/FileUpload.js'
import MenuBar from '../Editor/components/MenuBar'
import AnimationMenu from '../Editor/components/AnimationEditor/AnimationMenu.js'
function Menu({
  onModelUpload,
  onLightSelected,
  onMeshSelected,
  onGroupSelected,
  onScenePropsSelected,
  isXR,
  selectedItems,
  enterAnimationMode,
  onClick,
  onHoverOnAnimation,
  onSelectOnAnimation,
  onUnhoverOnAnimation,
}) {
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
  // now need to define boundaries for this to work as well.
  useEffect(() => {
    const closeViews = (e) => {
      if (!e.target.closest('.menu')) {
        setOptionsView(false)
        setModelView(false)
        setAnimationsView(false)
      }
    }
    document.body.addEventListener('click', closeViews)
    return () => document.body.removeEventListener('click', closeViews)
  }, [])
  return (

      <div className='menu flex flex-row h-full'>
        <Sidebar
          handleModelsClick={handleModelsClick}
          handleOptionsClick={handleOptionsClick}
          handleAnimationsClick={handleAnimationsClick}
        />
        {modelView && (
          <div
            className='flex flex-col items-center backdrop-blur-xl backdrop-filter  w-96 h-full overflow-auto'
            style={{
              position: 'absolute',
              left: 160,
              top: 0,
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              backgroundColor: 'rgba(255,255,255,0.4)',
            }}
          >
            <div className='w-5/6 max-w-lg'>
              <FileUpload onModelUpload={handleModelUpload} />
              <SearchModel onModelUpload={handleModelUpload} />
            </div>
          </div>
        )}
        {optionsView && (
          <div
            className='flex flex-col items-center backdrop-blur-xl backdrop-filter  w-1/5 h-full overflow-auto'
            style={{
              position: 'absolute',
              left: 160,
              top: 0,
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              backgroundColor: 'rgba(255,255,255,0.4)',
            }}
          >
            <div className='w-full'>
              <MenuBar
                onLightSelected={onLightSelected}
                onMeshSelected={onMeshSelected}
                onGroupSelected={onGroupSelected}
                onScenePropsSelected={onScenePropsSelected}
                isXR={false}
              />
            </div>
          </div>
        )}
        {animationsView && (
          <div
            className='flex flex-col items-center backdrop-blur-xl backdrop-filter  w-36 h-full overflow-auto'
            style={{
              position: 'absolute',
              left: 160,
              top: 0,
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              backgroundColor: 'rgba(255,255,255,0.4)',
            }}
          >
            <div className='w-full p-2'>
              <AnimationMenu
                isXR={isXR}
                selectedItems={selectedItems}
                enterAnimationMode={enterAnimationMode}
                onClick={onClick}
                onHoverOnAnimation={onHoverOnAnimation}
                onSelectOnAnimation={onSelectOnAnimation}
                onUnhoverOnAnimation={onUnhoverOnAnimation}
              />
            </div>
          </div>
        )}
        <div></div>
      </div>
  )
}

export default Menu
