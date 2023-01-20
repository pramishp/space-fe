import './App.css';
import Main from "./space/Main";
import DraggableBoxesVR from "./space/vr";
import Fiber from "./space/fiber";
import XRApp from "./space/webxr";
import {useEffect} from "react";

function App() {
    useEffect(() => {
        // call api or anything
        alert("loaded")
    });
    return (
        <div className="App" style={{height: window.innerHeight}}>
            {/*<DraggableBoxesVR/>*/}
            {/*<Main/>*/}
            {/*<Fiber/>*/}
            <XRApp/>

        </div>
    );
}

export default App;
