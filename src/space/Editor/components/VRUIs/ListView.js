import {Box} from "@react-three/flex";
import VRUIContainer from "./VRUIContainer";


export default function ListView({items, ListItem}) {

    return (
        <VRUIContainer>
            {(items.map((item) => {
                return (
                    <Box centerAnchor>
                        <ListItem {...item}/>
                    </Box>
                )
            }))}
        </VRUIContainer>
    )

}