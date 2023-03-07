import {Billboard, Plane} from "@react-three/drei";
import {Box, Flex, useFlexSize} from "@react-three/flex";
import * as THREE from "three";
import {Title} from "./Headings";

function InnerPlane() {
    return (
        <Plane args={[1, 1.6]} position={[0.5,-0.4,0]}>
            <meshPhongMaterial color={"#6B6B6B"} shininess={1} side={THREE.DoubleSide}/>
        </Plane>
    )
}

export default function VRUIContainer(props) {
    const {children, title} = props;
    // console.log('children', children)
    return (
        <Billboard
            follow={false}
            lockX={false}
            lockY={false}
            lockZ={false} // Lock the rotation on the z axis (default=false)
            rotation={[0, Math.PI / 2, 0]}
            {...props}
        >
            <InnerPlane/>
            <Flex justifyContent="center" alignItems="center" plane="xy">
                {title && <Box width="auto" height="auto" flexGrow={1} centerAnchor>
                    <Title>{title}</Title>
                </Box>}

                {Array.isArray(children) && children.map(child => {
                    return <Box width="auto" height="auto" flexGrow={1} centerAnchor>{child}</Box>
                })}
                {!Array.isArray(children) && children}
            </Flex>
        </Billboard>
    )
}
