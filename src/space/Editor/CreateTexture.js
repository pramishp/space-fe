import * as THREE from "three";


export function createBackgroundTexture(textureUrl, scene, callback) {
  console.log('is called')
  const loader = new THREE.TextureLoader();
  loader.load('https://threejs.org/examples/textures/crate.gif', (texture) => {
    console.log('loader called')
    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(texture, vUv);
        }
      `,
      side: THREE.FrontSide,
    });
    console.log('material')

    // Create a BoxGeometry with a large enough size to cover the entire scene
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const background = new THREE.Mesh(geometry, material);

    // Set the position of the background mesh to be behind all other objects in the scene
    background.position.set(0, 0, -10);

    // Add the background mesh to the scene
    scene.add(background);

    callback(material);
  }, undefined, (error) => {
    console.log('texture loading error', error);
  });
}