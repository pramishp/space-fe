import * as React from "react";

export default function Background({sceneBackgroundProps, refLight, refColor}) {
    const {color, light} = sceneBackgroundProps;
    const {intensity, color: lightColor} = light;
    const {args: colorArgs} = color;
    return (<>
        <ambientLight ref={refLight} intensity={intensity?intensity:10} color={lightColor?lightColor:'#ffffff'}/>
        <color ref={refColor} attach='background' args={colorArgs} uuid={'color'} op_type={'color'}/>
    </>)
}