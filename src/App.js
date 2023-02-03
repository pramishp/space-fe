import {Canvas} from "@react-three/fiber";

import './App.css';
import Renderer from "./space/Renderer";
import {sampleJson} from "./common/loader";
import styled, {ThemeProvider} from "styled-components";
import {useTheme} from "./space/hooks/useTheme";
import React, {useEffect, useState} from "react";
import {GlobalStyles} from "./utils/theme/GlobalStyles";
import SystemInterface from "./flow_1/containers/SystemInterface";
import {XR} from "@react-three/xr";
import {Environment, OrbitControls} from "@react-three/drei";
import UIPanel, {UIPanelPosition} from "./components/UIPanel";
import LayersPanel from "./containers/LayersPanel";

const Container = styled.div`
  //width: 500px;
`

function App() {
    const setRefs = (refs) => {

    }

    const {theme, themeLoaded} = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme);

    useEffect(() => {
        setSelectedTheme(theme);
    }, [themeLoaded]);


    return (
        <>
            {themeLoaded &&
                <ThemeProvider theme={selectedTheme}>
                    <Container>
                        <GlobalStyles/>
                        <div style={{height: window.innerHeight}}>
                            <LayersPanel/>
                            <Canvas style={{background: selectedTheme.colors.body}}
                                    camera={{position: [-3, 6, 6], fov: 25}}>
                                <XR>
                                    <SystemInterface>
                                    </SystemInterface>
                                    <Renderer data={sampleJson} setRefs={setRefs}/>
                                    <OrbitControls/>
                                    <Environment preset="city"/>
                                </XR>
                            </Canvas>
                        </div>
                    </Container>
                </ThemeProvider>
            }
        </>


    );
}

export default App;
