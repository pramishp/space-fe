import {Canvas} from "@react-three/fiber";

import './App.css';
import Renderer from "./space/Renderer";
import {sampleJson, sampleObjects} from "./common/loader";
import styled, {ThemeProvider} from "styled-components";
import {useTheme} from "./space/hooks/useTheme";
import React, {useEffect, useState} from "react";
import {GlobalStyles} from "./utils/theme/GlobalStyles";
import SystemInterface from "./flow_1/containers/SystemInterface";
import {XR} from "@react-three/xr";
import {Environment} from "@react-three/drei";
import LayersPanel from "./containers/LayersPanel";
import ObjectsLibrary from "./containers/ObjectsLibrary";
import {DragDropContext} from "@hello-pangea/dnd";
import {useMultiplayerState} from "./space/hooks/useMultiplayerState";
import {roomID} from "./space/store";

const Container = styled.div`
  //width: 500px;
`

function App() {
    const setRefs = (refs) => {

    }

    const {theme, themeLoaded} = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme);


    const {
        onMount,
        onChangePage,
        onInsertMesh,
        onDelete,
        onUndo,
        onRedo,
        loading,
        onChangePresence
    } = useMultiplayerState(roomID);

    useEffect(() => {
        setSelectedTheme(theme);
    }, [themeLoaded]);

    const onDragEnd = (result) => {
        // TODO:: Insert object on drag end
        console.log("On Drag End ::", result.draggableId);
        const mesh = {
            type: 'Mesh',
            position: [0, 0, 0],
            rotation: [0, 0, 0]
        }
        const geometry = {
            type: 'BoxGeometry',
            width: 1,
            height: 1,
            depth: 1,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1
        }
        const material = {
            type: 'MeshBasicMaterial',
            color: 65280,
        }

        onInsertMesh({mesh, geometry, material});


    }

    return (
        <>
            {themeLoaded &&
                <ThemeProvider theme={selectedTheme}>
                    <Container>
                        <GlobalStyles/>
                        <DragDropContext
                            onDragEnd={onDragEnd}

                        >
                            <div style={{height: window.innerHeight, position: 'relative'}}>
                                <LayersPanel data={sampleJson} setRefs={setRefs}/>
                                <ObjectsLibrary data={sampleObjects} setRefs={setRefs}/>
                                <Canvas style={{background: selectedTheme.colors.body}}
                                        camera={{position: [-3, 6, 6], fov: 50}}>
                                    <XR>
                                        <SystemInterface>
                                        </SystemInterface>
                                        <Renderer data={sampleJson} setRefs={setRefs}/>
                                        {/*<OrbitControls/>*/}
                                        <Environment preset="city"/>
                                    </XR>
                                </Canvas>
                            </div>
                        </DragDropContext>
                    </Container>
                </ThemeProvider>
            }
        </>


    );
}

export default App;
