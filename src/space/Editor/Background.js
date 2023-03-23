import * as React from "react";

export default function Background({sceneBackgroundProps, refLight, refColor}) {
    const {color, light} = sceneBackgroundProps;
    const {intensity, color: lightColor} = light;
    const {args: colorArgs} = color;
    return (<>
        <ambientLight ref={refLight} intensity={intensity} color={lightColor}/>
        <color ref={refColor} attach='background' args={colorArgs} uuid={'color'} op_type={'color'}/>
    </>)
}