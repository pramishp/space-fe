import {Billboard, Text, Sphere} from "@react-three/drei";
import {Flex, Box} from '@react-three/flex';


export default function DisplayUsers({isXR, otherUsers}) {

    return (
        <Billboard
            position={[0, 5, 0]}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false} // Lock the rotation on the z axis (default=false)
        >
            <Flex flexDirection="column" flexWrap="wrap">
                {/*<Box centerAnchor>*/}
                {/*    {otherUsers.length > 0 ? <Text color={'black'} fontSize={0.15}>Users:</Text>: null}*/}
                {/*</Box>*/}

                {otherUsers.map((item) => {
                        return (
                            <Box centerAnchor width="auto" height="auto" flexGrow={1}>
                                <Text color={'black'} fontSize={0.1}>{item.id}</Text>
                            </Box>
                        )
                    })}
            </Flex>
        </Billboard>
    )
}

