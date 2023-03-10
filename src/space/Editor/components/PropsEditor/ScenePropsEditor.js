import React from 'react'

//TODO: we might have a potential error if this component is used to update color when it is only component around.

// currently we are only handling light intensity and color here.
// also add to change the background color.
// send the function that updates the scene props here and let it do its magic
// import the scene Props ref then extract the props from there, from the extracted values determine the previous versions of the val and update accordingly.
//    (e) => {event.target.value}
export default function ScenePropsEditor({
                                             scenePropsRefGraph,
                                             onChangeScenePropsSelected,
                                             onAddScenePropsSelected
                                         }) {
    // based on the scenePropsRefGraph we can determine whether we are to update or add the ref properties.
    // console.log(scenePropsRefGraph)
    // console.log(scenePropsRefGraph['background'])
    // console.log(scenePropsRefGraph['background'].current)
    let lightProps, backgroundProps

    if (scenePropsRefGraph && scenePropsRefGraph['light'] && scenePropsRefGraph['light'].current) {
        lightProps = scenePropsRefGraph['light'].current
    }
    if (scenePropsRefGraph && scenePropsRefGraph['background'] && scenePropsRefGraph['background'].current) {
        backgroundProps = scenePropsRefGraph['background'].current
    }
    // TODO: give backgr
    // here if nothing has been set then change the code so that the oAddScenePropsSelected is called.
    const handleBackgroundColorChange = (e) => {
        console.log(backgroundProps)
        if (backgroundProps) {
            // backgroundProps['val'] = [e.target.value]
            // no need to set the background prop here as it will get updated later on.
            console.log('event after picked using target value', e.target.value)
            const args = [e.target.value]
            const val = {}
            val.op_type = 'color'
            val.val = {args}
            onChangeScenePropsSelected({uuid: 'background', val: val})
        } else {
            const args = [e.target.value]
            const val = {}
            val.op_type = 'color'
            val.val = {args}
            const id = {}
            id.uuid = 'background'
            id.val = val
            onAddScenePropsSelected(id)
        }


    }
    const handleLightColorChange = (e) => {
        lightProps['val']['color'] = e.target.value
        const val = {}
        val.op_type = 'light'
        val.val = {...lightProps}
        onChangeScenePropsSelected({uuid: 'light', val: val})
    }
    const handleLightIntensityChange = (e) => {
        lightProps['val']['intensity'] = e.target.value
        console.log(lightProps['val'])
        const val = {}
        val.op_type = 'light'
        val.val = {...lightProps}
        onChangeScenePropsSelected({uuid: 'light', val: val})

    }
    // set these three as state.
    let bgColor, lgColor, lightIntensity
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
