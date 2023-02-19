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

    const user = {userId: "aadsd345-khajs43"}

    return <Workspace roomId={"1234"} user={user}/>
}

export default App;