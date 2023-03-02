import {Billboard} from "@react-three/drei";
import {Box, Flex} from "@react-three/flex";

export default function VRUIContainer(props) {
    const {children} = props;
    // console.log('children', children)
     return (
        <Billboard
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false} // Lock the rotation on the z axis (default=false)
            {...props}
        >
            <Flex justifyContent="center" alignItems="center">

                {Array.isArray(children) && children.map(child => {
                    return <Box centerAnchor>{child}</Box>
                })}
                {!Array.isArray(children) && children}
            </Flex>
        </Billboard>
    )
}
