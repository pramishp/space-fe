import {useState, useEffect, useRef} from "react";


import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {ARButton} from 'three/addons/webxr/ARButton.js';
import {VRButton} from 'three/addons/webxr/VRButton.js';
import {XRControllerModelFactory} from 'three/addons/webxr/XRControllerModelFactory.js';


const intersected = [];
const tempMatrix = new THREE.Matrix4();

let controls, group;

const DraggableBoxesVR = () => {
    const refContainer = useRef();
    const [loading, setLoading] = useState(true);
    const [renderer, setRenderer] = useState();

    useEffect(() => {
        const {current: container} = refContainer;
        if (container && !renderer) {

            // initialize renderer
            const renderer = new THREE.WebGLRenderer({
                antialias: true, alpha: true
            })
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.shadowMap.enabled = true;
            renderer.xr.enabled = true;

            // add dom elements
            if(document.getElementsByTagName('canvas').length === 0) {

                // add vr button
                const vr_button = VRButton.createButton(renderer)
                const ar_button = ARButton.createButton(renderer)
                const vr_button_container = document.querySelector('#vr_button')
                const ar_button_container = document.querySelector('#ar_button')

                vr_button_container.appendChild(vr_button);
                ar_button_container.appendChild(ar_button);

                // add renderer HTML dom to the container
                container.appendChild(renderer.domElement)

                setRenderer(renderer)
            }

            // initialize scene
            const scene = new THREE.Scene()

            //initialize camera
            const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
            camera.position.set(0, 1.6, 3);

            //initialize controls
            controls = new OrbitControls(camera, container);
            controls.target.set( 0, 1.6, 0 );
            controls.update();

            // add floor to the scene
            const floorGeometry = new THREE.PlaneGeometry(4, 0);
            const floorMaterial = new THREE.MeshStandardMaterial({
                color: 0xeeeeee,
                roughness: 1.0,
                metalness: 0.0
            });
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -Math.PI / 2;
            floor.receiveShadow = true;
            scene.add(floor);

            // add light to the scene
            scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

            const light = new THREE.DirectionalLight(0xffffff);
            light.position.set(0, 6, 0);
            light.castShadow = true;
            light.shadow.camera.top = 2;
            light.shadow.camera.bottom = -2;
            light.shadow.camera.right = 2;
            light.shadow.camera.left = -2;
            light.shadow.mapSize.set(4096, 4096);
            scene.add(light);

            group = new THREE.Group();
            scene.add(group);


            const geometries = [
                new THREE.BoxGeometry(0.2, 0.2, 0.2),
                new THREE.ConeGeometry(0.2, 0.2, 64),
                new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64),
                new THREE.IcosahedronGeometry(0.2, 8),
                new THREE.TorusGeometry(0.2, 0.04, 64, 32)
            ];

            // randomly add geometries
            for (let i = 0; i < 50; i++) {

                const geometry = geometries[Math.floor(Math.random() * geometries.length)];
                const material = new THREE.MeshStandardMaterial({
                    color: Math.random() * 0xffffff,
                    roughness: 0.7,
                    metalness: 0.0
                });

                const object = new THREE.Mesh(geometry, material);

                object.position.x = Math.random() * 4 - 2;
                object.position.y = Math.random() * 2;
                object.position.z = Math.random() * 4 - 2;

                object.rotation.x = Math.random() * 2 * Math.PI;
                object.rotation.y = Math.random() * 2 * Math.PI;
                object.rotation.z = Math.random() * 2 * Math.PI;

                object.scale.setScalar(Math.random() + 0.5);

                object.castShadow = true;
                object.receiveShadow = true;

                group.add(object);

            }

            // handle interactions

            const raycaster = new THREE.Raycaster();

            //

            const onWindowResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);

                // to update the state on window resize and force render
                setRenderer(renderer)
            }

            const getIntersections = (controller) => {
                tempMatrix.identity().extractRotation(controller.matrixWorld);

                raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
                raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

                return raycaster.intersectObjects(group.children, false);

            }
            const onSelectStart = (event) => {

                const controller = event.target;

                const intersections = getIntersections(controller);

                if (intersections.length > 0) {

                    const intersection = intersections[0];

                    const object = intersection.object;
                    object.material.emissive.b = 1;
                    controller.attach(object);

                    controller.userData.selected = object;

                }

            }

            const onSelectEnd = (event) => {

                const controller = event.target;

                if (controller.userData.selected !== undefined) {

                    const object = controller.userData.selected;
                    object.material.emissive.b = 0;
                    group.attach(object);

                    controller.userData.selected = undefined;

                }


            }

            const intersectObjects = (controller) => {

                // Do not highlight when already selected

                if (controller.userData.selected !== undefined) return;

                const line = controller.getObjectByName('line');
                const intersections = getIntersections(controller);

                if (intersections.length > 0) {

                    const intersection = intersections[0];

                    const object = intersection.object;
                    object.material.emissive.r = 1;
                    intersected.push(object);

                    line.scale.z = intersection.distance;

                } else {

                    line.scale.z = 5;

                }

            }

            // add controllers
            // controllers

            const controller1 = renderer.xr.getController(0);
            controller1.addEventListener('selectstart', onSelectStart);
            controller1.addEventListener('selectend', onSelectEnd);
            scene.add(controller1);

            const controller2 = renderer.xr.getController(1);
            controller2.addEventListener('selectstart', onSelectStart);
            controller2.addEventListener('selectend', onSelectEnd);
            scene.add(controller2);

            const controllerModelFactory = new XRControllerModelFactory();

            const controllerGrip1 = renderer.xr.getControllerGrip(0);
            controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
            scene.add(controllerGrip1);

            const controllerGrip2 = renderer.xr.getControllerGrip(1);
            controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
            scene.add(controllerGrip2);

            //
            const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);

            const line = new THREE.Line(geometry);
            line.name = 'line';
            line.scale.z = 5;

            controller1.add(line.clone());
            controller2.add(line.clone());


            // handle events
            window.addEventListener('resize', onWindowResize);

            const render = () => {
                // cleanIntersected();
                //
                intersectObjects(controller1);
                intersectObjects(controller2);

                renderer.render(scene, camera);
            }

            let animation_req;
            const animate = () => {

                animation_req = requestAnimationFrame(animate);
                renderer.setAnimationLoop(render);
                controls.update();

            }
            setLoading(false)
            animate();
            return () => {
                // clear animation frame if any
                // dispose renderer
                renderer.dispose();
                // cancelAnimationFrame(animation_req);
            };
        }

    })

    return (
        <div
            style={{height: window.innerHeight, width: window.innerWidth, position: "relative"}}
            ref={refContainer}
        >
            <div id={"vr_button"} style={{position:'absolute', bottom:100, left:0, zIndex:10000, width:400, height:45}}>

            </div>
            <div id={"ar_button"} style={{position:'absolute', bottom:100, right:0, zIndex:10000, width:400, height:45}}>

            </div>
            {loading && (
                <span style={{position: "absolute", left: "50%", top: "50%"}}>
          Loading...
        </span>
            )}
        </div>
    )
}


function cleanIntersected() {

    while (intersected.length) {

        const object = intersected.pop();
        object.material.emissive.r = 0;

    }

}

//


export default DraggableBoxesVR