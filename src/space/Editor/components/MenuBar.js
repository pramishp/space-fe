import sphereImage from '../../../assets/sphere.png'
import cubeImage from '../../../assets/cube.png'

import React, {useState} from 'react'
import {Interactive} from '@react-three/xr'
import {Box, Text} from '@react-three/drei'
import {Button} from './VRUIs/Button'
import VRUIContainer from './VRUIs/VRUIContainer'
import {Heading6} from './VRUIs/Headings'
import Icon from "../../../common/components/Icon";


function VRMenuItem({menuItem, handleButtonSelect, isXR}) {
    //onCli(ck, onHover, title, isXR
    return (
        <Button
            isXR={isXR}
            title={menuItem.name}
            onClick={() => handleButtonSelect(menuItem)}
        />
    )
}

function MenuBar({
                     isXR,
                     onMeshSelected,
                     onLightSelected,
                     onGroupSelected,
                     onScenePropsSelected,
                 }) {
    const meshOptions = [
        {name: 'Sphere', id: 'sphere', img: 'menu/mesh/sphere'},
        {name: 'Box', id: 'box', img: 'menu/mesh/box'},
        {name: 'Cylinder', id: 'cylinder', img: 'menu/mesh/cylinder'},
        {name: 'Plane', id: 'plane', img: 'menu/mesh/plane'},
        {name: 'Ellipse', id: 'ellipse', img: 'menu/line/ellipse'},
        {name: 'Line', id: 'line', img: 'menu/line/line'},
    ]

    const lightOptions = [
        // { name: 'Ambient', id: 'ambient', img:''},
        {name: 'Directional', id: 'directional', img: 'menu/lights/directional'},
        {name: 'Point', id: 'point', img: 'menu/lights/point'},
    ]
    const groupOptions = [{name: 'Group', id: 'group', img: ''}]

    const backgroundOptions = [

        {name: 'Stars', id: 'stars', img: 'menu/background/stars'},
        {name: 'Sky', id: 'sky', img: 'menu/background/sky'},
        // { name: 'Color', id: 'color', img:'' },
        // { name: 'Environment', id: 'environment', img:'' },
    ]

    const handleMeshSelected = (id) => {
        // const selectedId = event.target.value
        onMeshSelected(id)
    }

    const handleLightSelected = (id) => {
        // const selectedId = event.target.value;
        onLightSelected(id)
    }

    const handleGroupSelected = (id) => {
        // const selectedId = event.target.value;
        onGroupSelected(id)
    }

    const handleButtonSelect = (menuItem) => {
        const selectedId = menuItem.id
        onMeshSelected(selectedId)
    }

    const handleBackgroundSelected = (id) => {
        // const selectedId = event.target.value
        // console.log('selectedId', selectedId)
        onScenePropsSelected(id)
    }

    if (isXR) {
        const meshOptionsJSX = meshOptions.map((menuItem, index) => {
            return (
                <VRMenuItem
                    isXR={isXR}
                    menuItem={menuItem}
                    handleButtonSelect={handleButtonSelect}
                />
            )
        })

        const lightOptionsJSX = lightOptions.map((menuItem, index) => {
            return (
                <VRMenuItem
                    isXR={isXR}
                    menuItem={menuItem}
                    handleButtonSelect={handleButtonSelect}
                />
            )
        })

        return (
            <>
                <VRUIContainer position={[-4, 1, 0]} title={'Objects'}>
                    {meshOptionsJSX}
                </VRUIContainer>
                <VRUIContainer position={[-4, 1, -1]} title={'Lights'}>
                    {lightOptionsJSX}
                </VRUIContainer>
            </>
        )
    }

    return (
        <div className='flex flex-col'>
            <div className='text-left'>
                <h2 className='py-4 px-2 font-bold text-lg'>Add Objects</h2>
            </div>
            <div className='text-left'>
                <h5 className='mb-2 px-2 py-2 border-b-2 font-bold'>Mesh</h5>
            </div>
            <br/>
            <div className=''>
                <div className=' p-3' style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr)",
                    gridGap: 20
                }}>
                    {meshOptions.map((option) => (
                        <div key={option.id} className={"cursor-pointer p-2 flex flex-col rounded-xl items-center justify-center gap-3 hover:bg-blue-500 border-transparent hover:border-blue-500 hover:text-white"}>
                            <Icon
                                name={option.img}
                                className='w-24 h-24 cursor-pointer'
                                onClick={() => handleMeshSelected(option.id)}
                            />
                            <div className="text-sm">{option.name}</div>
                        </div>
                    ))}
                </div>
            </div>
            <br/><br/>
            <div className='text-left'>
                <h5 className='mb-2 px-2 py-2 border-b-2 font-bold'>Light</h5>
            </div>
            <br/>
            <div className={"p-3"}>
                {lightOptions.map((option) => (
                    <>
                        <div key={option.id}
                             className={"flex items-center cursor-pointer rounded-full px-3 py-2 gap-2 hover:bg-blue-500 hover:text-white"}>
                            <Icon
                                name={option.img}
                                className='w-12 h-12 cursor-pointer icon-sm'
                                onClick={() => handleLightSelected(option.id)}
                            />
                            <div className="text-sm">{option.name}</div>
                        </div>
                    </>
                ))}
            </div>
            <div className='text-left'>
                <h5 className='mb-2 px-2 py-2 border-b-2 font-bold'>Backgrounds</h5>
            </div>
            <br/>
            <div className=' p-3'
                 style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr)", gridGap: 20}}>
                {backgroundOptions.map((option) => (
                    <div key={option.id} className={"cursor-pointer p-2 flex flex-col rounded-xl items-center justify-center gap-3 hover:bg-blue-500 border-transparent hover:border-blue-500 hover:text-white"}>
                        <Icon
                            name={option.img}
                            className='w-24 h-24 cursor-pointer'
                            onClick={() => handleBackgroundSelected(option.id)}
                        />
                        <div className="text-sm">{option.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MenuBar
