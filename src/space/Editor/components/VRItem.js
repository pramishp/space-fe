import { RayGrab, Interactive } from '@react-three/xr'
import React from 'react'

function VRItem(props) {
    const handleSelect = (event) => {
        console.log(event);
        // props.onSelect()
        // 
    }

    console.log("Props children : ", props.children);
    return (
        <>
            <RayGrab>
                <Interactive
                    onSelect={(event) => handleSelect(event)}
                >
                    {props.children}
                </Interactive>
            </RayGrab>
        </>
    )
}

export default VRItem