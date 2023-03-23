import {Billboard, Text, Sphere} from "@react-three/drei";
import {Flex, Box} from '@react-three/flex';
import NameCircle from "./uis/NameCircle";
import VRUIContainer from "./VRUIs/VRUIContainer";
import {Title} from "./VRUIs/Headings";
import {Button} from "./VRUIs/Button";


export default function DisplayUsers({isXR, otherUsers}) {
    console.log('other users', otherUsers)
    if (otherUsers.length === 0){
        return <></>
    }

    if (isXR){
        return (
            <VRUIContainer position={[-4, 1, 2]} title={"Other Users"}>
                    {otherUsers.map((item) => {
                        const {first, last} = item.tdUser.name;
                        return (
                                <Button title={`${first} ${last}`}/>
                        )
                    })}
            </VRUIContainer>
        )
    }

    return (
        <div style={{
            position:"absolute",
            top:8,
            right:20,
            zIndex:10000,
            display: "flex",
            gap:5,
            justifyContent: "right",
            alignItems: "center"
        }}>
            {otherUsers.map((item) => {
                return (
                    <NameCircle {...item.tdUser.name}/>
                )
            })}
        </div>
    )

}

