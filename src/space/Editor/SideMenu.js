import ListView from "./components/VRUIs/ListView";
import {Box} from "@react-three/flex";
import {Title} from "./components/VRUIs/Headings";
import {Image} from "@react-three/drei";

export function ListItemView({name, image_url, onClick}) {

    return (
        <>
            <Box>
                <Title>{name}</Title>
            </Box>
            <Box>
                <Image url={image_url} onClick={onClick}/>
            </Box>
        </>

    )
}

export default function SideMenu() {
    const item = {
        id: "khj45kj345",
        name: "Sun",
        image_url: "https://static.turbosquid.com/Preview/2019/07/29__11_55_11/2.jpg4CDB029D-FCC2-4A4A-89D2-23509B0F41B8Default.jpg",
        model_url: "",
        onClick: () => {
            console.log(item.id)
        }
    }

    return (
        <ListView
            position={[1, 4, 0]}
            items={[item, item]}
            ListItem={ListItemView}/>
    )
}