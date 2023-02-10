import {Canvas} from "@react-three/fiber";

import './App.css';
import Renderer from "./space/Renderer";
import {sampleJson} from "./common/loader";

function App() {
    const setRefs = (refs) => {

    }
// this is the original line that was removeed
// <Renderer data={sampleJson} setRefs={setRefs}/>

    return (
        <div className="App" style={{height: window.innerHeight}}>
            <Canvas>
                <Renderer />
            </Canvas>
        </div>
    );
}

export default App;
