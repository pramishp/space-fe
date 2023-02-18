import {OrbitControls} from "@react-three/drei";

export default function Controls(props){
    return (
        <OrbitControls
            // minAzimuthAngle={0}
            // maxAzimuthAngle={0}
            // minPolarAngle={Math.PI / 2}
            // maxPolarAngle={Math.PI / 2}
            enableDamping={true}
            target={[0,0,0]}
            {...props}/>
    )
}

