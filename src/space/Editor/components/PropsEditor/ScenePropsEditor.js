import React, {useState} from 'react'

//TODO: we might have a potential error if this component is used to update color when it is only component around.

// currently we are only handling light intensity and color here.
// also add to change the background color.
// send the function that updates the scene props here and let it do its magic
// import the scene Props ref then extract the props from there, from the extracted values determine the previous versions of the val and update accordingly.
//    (e) => {event.target.value}

export default function ScenePropsEditor({
                                             refScenePropsGraph,
                                             onChangeScenePropsSelected,
                                         })
{
    function rgbToHex({ r, g, b }) {
        // console.log(r, g, b)
        const red = Math.round(r*255).toString(16).padStart(2, '0');
        const green = Math.round(g*255).toString(16).padStart(2, '0');
        const blue = Math.round(b*255).toString(16).padStart(2, '0');
        // console.log(`#${red}${green}${blue}`)
        return `#${red}${green}${blue}`;
      }
      console.log(refScenePropsGraph.color)
    if (refScenePropsGraph.light.current === null || refScenePropsGraph.color.current === null) {
        // console.log('isNull')
        return (
            <></>
        )
    }

    const lightProps = refScenePropsGraph.light.current
    const backgroundProps = refScenePropsGraph.color.current
    // console.log(backgroundProps.r, backgroundProps.g, backgroundProps.b)
    console.log(backgroundProps.getHexString())
    const [bgColor, setBgColor] = useState(`#${backgroundProps.getHexString()}`)
    const [lgColor, setLgColor] = useState(`#${lightProps.color}`)
    const [lightIntensity, setLightIntensity] = useState(lightProps.intensity)

    const handleBackgroundColorChange = (e) => {
            console.log('event after picked using target value', e.target.value)
            setBgColor(e.target.value)

            const key = 'args'
            const val = e.target.value
            onChangeScenePropsSelected({uuid: 'color', val: val, key:key})
    }
    const handleLightColorChange = (e) => {
        console.log('handleLightColorChange called')
        setLgColor(e.target.value)

        const key = 'color'
        const val = e.target.value
        onChangeScenePropsSelected({uuid: 'light', val: val, key:key})
    }
    const handleLightIntensityChange = (e) => {
        setLightIntensity(e.target.value)

        const key = 'intensity'
        const val = e.target.value
        onChangeScenePropsSelected({uuid: 'light', val: val, key:key})

    }
    const lmin = 1,
        lmax = 10

    return (
        <div className='flex items-center gap-3 bg-gray-100 border-b border-gray-300 px-4'>
            <div className='ml-4 rounded my-2 px-4  py-2 flex items-center hover:bg-blue-100 hover:border-blue-500 border-2'>
                <label htmlFor='color' className='font-medium'>
                    Background Color
                </label>
                <input
                    type='color'
                    id='color'
                    value={bgColor}
                    onChange={handleBackgroundColorChange}
                    className='ml-2 w-8 h-8 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </div>
            <div className='ml-4 rounded my-2 px-4  py-2 flex items-center hover:bg-blue-100 hover:border-blue-500 border-2'>
                <label htmlFor='color' className='font-medium'>
                    Light Color
                </label>
                <div className="w-2"></div>
                <input
                    type='color'
                    id='color'
                    value={lgColor}
                    onChange={handleLightColorChange}
                    className='ml-2 w-8 h-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden'
                />
            </div>
            <div className='ml-4 rounded my-2 px-4  py-2 flex items-center hover:bg-blue-100 hover:border-blue-500 border-2'>
                <label
                    htmlFor='widthSegments'
                    className='text-sm uppercase text-gray-600'
                >
                    Light Intensity
                </label>
                <div>
                    <input
                        type='range'
                        id='widthSegments'
                        min={lmin}
                        max={lmax}
                        step='1'
                        value={lightIntensity}
                        onChange={handleLightIntensityChange}
                        className='w-48 h-4 appearance-none bg-gray-300 rounded-full focus:outline-none focus:ring-2'
                        style={{
                            background: `linear-gradient(to right, #7F00FF 0%, #7F00FF
            ${((lightIntensity - 1) / (lmax - lmin)) * 100}%,
            #D5D5D5 ${((lightIntensity - 1) / (lmax - lmin)) * 100}%,
            #D5D5D5 100%)`,
                        }}
                    />
                    {/*<output className='ml-2 text-gray-600'>{widthSegments}</output>*/}
                </div>
            </div>
        </div>
    )
}
/* <div style={{
        display: "flex",
            justifyContent: "center",
            alignItems: "center"
    }}>
    <label>Background:</label>
    <select
className='w-full px-4 py-2 rounded-md border border-gray-300 mt-2'
value={bgMode}
onChange={handleBackgroundSelected}
    >
    {backgroundOptions.map((option) => (
        <option key={option.id} value={option.id}>
        {option.name}
        </option>
    ))}
    </select>
//TODO: Add condition for color option display
//
    //
/*{<div>
        <label htmlFor="color">Color:</label>
        <input
    type="color"
    id="color"
    value={scenePropsColor}
    onChange={handleColorChange}
        />
        </div>}
    </div> */
