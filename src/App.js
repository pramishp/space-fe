import './App.css';
import Renderer from "./space/Renderer";
import {sampleJson} from "./common/loader";

function App() {

    return (
        <div className="App" style={{height: window.innerHeight}}>
            <Renderer data={sampleJson}/>
        </div>
    );
}

export default App;
