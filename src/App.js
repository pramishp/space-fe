import {Canvas} from "@react-three/fiber";

import './App.css';
import Renderer from "./space/Renderer";
import {sampleJson} from "./common/loader";

function App() {
    const setRefs = (refs) => {

    }


    return (
        <div className="App" style={{height: window.innerHeight}}>
            <Canvas>
                <Renderer data={sampleJson} setRefs={setRefs}/>
            </Canvas>
        </div>
    );
}

export default App;
