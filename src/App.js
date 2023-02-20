import Workspace from "./space/Workspace/Workspace";
import {useEffect, useState} from "react";

function App(){
    const [isXR, setXR] = useState(false);


    useEffect(() => {
        checkXR();
    })

    const checkXR = () => {
        if (navigator.xr) {
            setXR(true)
        } else {
            setXR(false)
        }
    }

    const user = {id: "aadsd345-khajs43"}
    const roomId = "1234"

    return <Workspace roomId={roomId} user={user}/>
}

export default App;