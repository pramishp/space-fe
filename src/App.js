import {useEffect, useRef, useState} from "react";
import {Canvas} from "@react-three/fiber";

import './App.css';
import Renderer from "./space/Renderer";
import AnimationApp from "./space/Animation";
import Presentation from "./space/Presentation";
import XRApp from "./space/webxr";
import Editor from "./space/Editor/EditorClass";
import {BASIC_LIGHTS} from "./space/Editor/constants";
import {MyComponent} from "./space/RefTest";

function App() {
    const [isXR, setXR] = useState(false);
    const setRefs = (refs) => {

    }

    const checkXR = () => {
        if (navigator.xr) {
            setXR(true)
        } else {
            setXR(false)
        }
    }
    useEffect(() => {
        checkXR();
    })

    const app = {}
    app.user = {userId: "123"}
    app.onMeshInserted = ({uuid, val}) => {
        console.log('on mesh inserted with id ', uuid)
    }

    /**
     * `animationOrderChanged` is a callback function triggered by Editor that takes an
     * object with a `uuid`:(animation uuid from slide) and a `to`: (order) property and returns
     * nothing
     */

    app.animationOrderChanged = ({uuid, to})=>{
        console.log(uuid, " applied animation order changed to ", to)
    }

    const initData = {

    }

    const slideData = {

    }
    const editorRef = useRef();
    const onClick = ()=>{
        if (editorRef){
            console.log(editorRef)
        }
    }

    return (
        <div className="App" style={{height: window.innerHeight}}>
            {/*<Canvas>*/}
            {/*    /!*<Renderer data={sampleJson} setRefs={setRefs}/>*!/*/}

            {/*    /!*<AnimationApp/>*!/*/}

            {/*</Canvas>*/}
            <button onClick={onClick}>Get Editor Ref</button>
            <Editor ref={editorRef} app={app} initData={initData} slideData={slideData} isXR={isXR}/>
            {/*<MyComponent/>*/}
            {/*<XRApp/>*/}
        </div>
    );
}

export default App;
