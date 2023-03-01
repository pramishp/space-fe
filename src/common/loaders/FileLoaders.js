import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


export function loadGltf(fileContents, onLoad, onError) {
    // // Instantiate a loader
    const loader = new GLTFLoader()
    loader.parse(fileContents, '', (gltf) => {
            // Add the GLTF to the scene
            onLoad(gltf)
        },
        // called when loading has errors
        function (error) {

            onError(error);
        });
//loader.load(url)

}


export function loadGltfFromUrl(url, onLoad, onError) {
    // // Instantiate a loader
    const loader = new GLTFLoader()
    loader.load(url, onLoad, (progress)=>{
            console.log('gltf loading progress', progress.loaded/progress.total)
        },
        // called when loading has errors
        function (error) {

            onError(error);
        });

}


