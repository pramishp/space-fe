import './App.css';
import Main from "./space/Main";
import DraggableBoxesVR from "./space/vr";
import Fiber from "./space/fiber";
import XRApp from "./space/webxr";

function App() {
    return (
        <div className="App" style={{height:window.innerHeight}}>
            {/*<DraggableBoxesVR/>*/}
            {/*<Main/>*/}
            {/*<Fiber/>*/}
            <XRApp/>

        </div>
    );
}

export default App;
