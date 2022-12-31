import { useState, useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function loadGLTFModel(scene, glbPath, options) {
    const { receiveShadow, castShadow } = options;
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            glbPath,
            (gltf) => {
                const obj = gltf.scene;
                obj.name = "dinosaur";
                obj.position.y = 0;
                obj.position.x = 0;
                obj.receiveShadow = receiveShadow;
                obj.castShadow = castShadow;
                scene.add(obj);

                obj.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = castShadow;
                        child.receiveShadow = receiveShadow;
                    }
                });

                resolve(obj);
            },
            undefined,
            function (error) {
                console.log(error);
                reject(error);
            }
        );
    });
}

function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 4));
}

const Dinosaur = () => {
    const refContainer = useRef();
    const [loading, setLoading] = useState(true);
    const [renderer, setRenderer] = useState();

    useEffect(() => {
        const { current: container } = refContainer;
        if (container && !renderer) {
            const scW = container.clientWidth;
            const scH = container.clientHeight;
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            setRenderer(renderer);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(scW, scH);
            renderer.outputEncoding = THREE.sRGBEncoding;

            if(document.getElementsByTagName('canvas').length === 0) {
                container.appendChild(renderer.domElement);
            }

            const scene = new THREE.Scene();
            const scale = 5.6;
            const camera = new THREE.OrthographicCamera(
                -scale,
                scale,
                scale,
                -scale,
                0.01,
                50000
            );
            const target = new THREE.Vector3(-0.5, 1.2, 0);
            const initialCameraPosition = new THREE.Vector3(
                20 * Math.sin(0.2 * Math.PI),
                10,
                20 * Math.cos(0.2 * Math.PI)
            );

            const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
            scene.add(ambientLight);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.autoRotate = true;
            controls.target = target;

            loadGLTFModel(scene, "/dino.glb", {
                receiveShadow: false,
                castShadow: false
            }).then(() => {
                animate();
                setLoading(false);
            });

            let req = null;
            let frame = 0;
            const animate = () => {
                req = requestAnimationFrame(animate);
                frame = frame <= 100 ? frame + 1 : frame;

                if (frame <= 1) {
                    const p = initialCameraPosition;

                    camera.position.y = p.y
                    camera.position.x = p.x
                    camera.position.z = p.z
                    camera.lookAt(target);
                } else {
                    controls.update();

                }

                renderer.render(scene, camera);
            };

            return () => {
                cancelAnimationFrame(req);
                renderer.dispose();
            };
        }
    }, []);

    return (
        <div
            style={{ height: window.innerHeight, width: window.innerWidth, position: "relative" }}
            ref={refContainer}
        >
            {loading && (
                <span style={{ position: "absolute", left: "50%", top: "50%" }}>
          Loading...
        </span>
            )}
        </div>
    );
};

export default function Main() {
    return (
        <div style={{ width: "100%", margin: "0 auto" }}>
            <Dinosaur />
        </div>
    );
}
