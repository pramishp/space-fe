import './App.css';
import XRApp from "./space/Exp";
import {useEffect} from "react";

function App() {

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
