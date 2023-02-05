import {Canvas} from "@react-three/fiber";

import './App.css';
import Renderer from "./space/Renderer";
import {sampleJson} from "./common/loader";
import AnimationApp from "./space/Animation";
import Presentation from "./space/Presentation";
import XRApp from "./space/webxr";

function App() {
    const setRefs = (refs) => {

    }


    return (
        <div className="App" style={{height: window.innerHeight}}>
            <Canvas>
                <Renderer data={sampleJson} setRefs={setRefs}/>
                {/*<AnimationApp/>*/}
                {/*<Presentation data={sampleJson}/>*/}
            </Canvas>
            {/*<XRApp/>*/}
        </div>
    );
}

export default App;
