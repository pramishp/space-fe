import ThreeMeshUI from 'three-mesh-ui'
import * as THREE from 'three';

// assets
import FontJSON from '../assets/Roboto-msdf.json';
import FontImage from '../assets/Roboto-msdf.png';

const Button = (props) => {
    // const {onHover, onClick, renderer, scene, camera, controls} = props;
    const container = makePanel(props)

    // return {container, callback: (container) => loop({...props, meshContainer: container})}
    return {container, callback: loop}

}

function loop(props) {
    const {controls, meshContainer, renderer, scene, camera} = props
    // Don't forget, ThreeMeshUI must be updated manually.
    // This has been introduced in version 3.0.0 in order
    // to improve performance
    ThreeMeshUI.update();

    controls.update();

    meshContainer.rotation.z += 0.01;
    meshContainer.rotation.y += 0.01;

    renderer.render(scene, camera);

    updateButtons(props);

}

// Called in the loop, get intersection with either the mouse or the VR controllers,
// then update the buttons states according to result

function updateButtons({renderer, camera, vrControl, raycaster, mouse, objsToTest, selectState}) {

    // Find closest intersecting object

    let intersect;

    if (renderer.xr.isPresenting) {

        vrControl.setFromController(0, raycaster.ray);

        intersect = raycast();

        // Position the little white dot at the end of the controller pointing ray
        if (intersect) vrControl.setPointerAt(0, intersect.point);

    } else if (mouse.x !== null && mouse.y !== null) {

        raycaster.setFromCamera(mouse, camera);

        intersect = raycast();

    }

    // Update targeted button state (if any)

    if (intersect && intersect.object.isUI) {

        if (selectState) {

            // Component.setState internally call component.set with the options you defined in component.setupState
            intersect.object.setState('selected');

        } else {

            // Component.setState internally call component.set with the options you defined in component.setupState
            intersect.object.setState('hovered');

        }

    }

    // Update non-targeted buttons state

    objsToTest.forEach((obj) => {

        if ((!intersect || obj !== intersect.object) && obj.isUI) {

            // Component.setState internally call component.set with the options you defined in component.setupState
            obj.setState('idle');

        }

    });

}

function makePanel({scene, onClick, objsToTest}) {

    // Container block, in which we put the two buttons.
    // We don't define width and height, it will be set automatically from the children's dimensions
    // Note that we set contentDirection: "row-reverse", in order to orient the buttons horizontally

    const container = new ThreeMeshUI.Block({
        justifyContent: 'center',
        contentDirection: 'row-reverse',
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontSize: 0.07,
        padding: 0.02,
        borderRadius: 0.11
    });

    container.position.set(0, 0.6, -1.2);
    container.rotation.x = -0.55;
    scene.add(container);
    // scene.add(ThreeMeshUI.Text({content: 'Oh Yeahhh'}))

    // BUTTONS

    // We start by creating objects containing options that we will use with the two buttons,
    // in order to write less code.

    const buttonOptions = {
        width: 0.4,
        height: 0.15,
        justifyContent: 'center',
        offset: 0.05,
        margin: 0.02,
        borderRadius: 0.075
    };

    // Options for component.setupState().
    // It must contain a 'state' parameter, which you will refer to with component.setState( 'name-of-the-state' ).

    const hoveredStateAttributes = {
        state: 'hovered',
        attributes: {
            offset: 0.035,
            backgroundColor: new THREE.Color(0x999999),
            backgroundOpacity: 1,
            fontColor: new THREE.Color(0xffffff)
        },
    };

    const idleStateAttributes = {
        state: 'idle',
        attributes: {
            offset: 0.035,
            backgroundColor: new THREE.Color(0x666666),
            backgroundOpacity: 0.3,
            fontColor: new THREE.Color(0xffffff)
        },
    };

    // Buttons creation, with the options objects passed in parameters.

    const button = new ThreeMeshUI.Block(buttonOptions);

    // Add text to buttons

    button.add(
        new ThreeMeshUI.Text({content: 'Oh Yeahhh'})
    );

    // Create states for the buttons.
    // In the loop, we will call component.setState( 'state-name' ) when mouse hover or click

    const selectedAttributes = {
        offset: 0.02,
        backgroundColor: new THREE.Color(0x777777),
        fontColor: new THREE.Color(0x222222)
    };

    button.setupState({
        state: 'selected',
        attributes: selectedAttributes,
        onSet: () => {

            onClick()

        }
    });
    button.setupState(hoveredStateAttributes);
    button.setupState(idleStateAttributes);


    container.add(button);
    objsToTest.push(button);

    return container

}

function raycast({raycaster, objsToTest}) {

    return objsToTest.reduce((closestIntersection, obj) => {

        const intersection = raycaster.intersectObject(obj, true);

        if (!intersection[0]) return closestIntersection;

        if (!closestIntersection || intersection[0].distance < closestIntersection.distance) {

            intersection[0].object = obj;

            return intersection[0];

        }

        return closestIntersection;

    }, null);

}

export default Button