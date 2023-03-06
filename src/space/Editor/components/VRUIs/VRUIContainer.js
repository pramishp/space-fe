import {Billboard, Plane} from "@react-three/drei";
import {Box, Flex, useFlexSize} from "@react-three/flex";

function InnerPlane() {
    const [width, height] = useFlexSize()
    return(
            <Plane args={[width, height]} color={"#6B6B6B"}/>
    )
}

export default function VRUIContainer(props) {
    const {children} = props;
    // console.log('children', children)
    return (
        <Billboard
            follow={false}
            lockX={false}
            lockY={false}
            lockZ={false} // Lock the rotation on the z axis (default=false)
            {...props}
        >
            <Plane args={[3, 2]} color={"#6B6B6B"}/>
            <Flex justifyContent="center" alignItems="center" plane="xy">
                {Array.isArray(children) && children.map(child => {
                    return <Box width="auto" height="auto" flexGrow={1} centerAnchor>{child}</Box>
                })}
                {!Array.isArray(children) && children}
            </Flex>
        </Billboard>
    )
}
