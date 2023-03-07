import {ANIMATION_TYPES} from "../../constants";
// TODO: add icon or image here.
import translateImg from '../../../../assets/translation_animation.png';
import scaleImg from '../../../../assets/scale_animation.png';
import rotateImg from '../../../../assets/rotation_animation.png';
import pathImg from '../../../../assets/path_animation.png'
export const animations = {
    'd7fbf2ba-b04c-4f59-acbd-6c5563d8b53d': {
        name: 'position',
        duration: 3,
        type: ANIMATION_TYPES.KEYFRAME,
        tracks: [
            {
                name: '.position',
                times: [0, 0.5, 1],
                values: [
                    2, 0, 0, 3, 0,
                    0, 2, 0, 0
                ],
                type: 'vector'
            }
        ],
        uuid: 'd7fbf2ba-b04c-4f59-acbd-6c5563d8b53d',
        img: translateImg,
        blendMode: 2500
    },
    'd77c5fc4-f70b-4ec3-ace7-3dd187185451': {
        name: 'scale',
        duration: 3,
        type: ANIMATION_TYPES.KEYFRAME,
        tracks: [
            {
                name: '.scale',
                times: [0, 0.5, 1],
                values: [
                    1, 1, 1, 2, 2,
                    2, 1, 1, 1
                ],
                type: 'vector'
            }

        ],
        uuid: 'd77c5fc4-f70b-4ec3-ace7-3dd187185451',
        img: scaleImg,
        blendMode: 2500
    },
    "fc0a8baa-2226-49b9-989b-3ddfc3051a84": {
        name: 'rotation y',
        duration: 3,
        type: ANIMATION_TYPES.KEYFRAME,
        tracks: [
            {
                name: '.quaternion',
                "times": [0, 0.5, 1],
                "values": [
                    0,0,0,1, // Start at zero rotation
                    0,0.7071,0,0.7071, // Rotate 90 degrees
                    0,1,0,0 // Rotate 180 degrees
                ],
                type: 'quaternion'
            }

        ],
        uuid: 'fc0a8baa-2226-49b9-989b-3ddfc3051a84',
        img: rotateImg,
        clampWhenFinished: true,
        blendMode: 2500
    },
    "xd0a8baa-2226-49b9-989b-3ddfc3051a85": {
        name: 'rotation x',
        duration: 3,
        type: ANIMATION_TYPES.KEYFRAME,
        tracks: [
            {
                name: '.quaternion',
                "times": [0, 0.5, 1],
                "values": [
                    0,0,0,1, // Start at zero rotation
                    0.7071,0,0,-0.7071, // Rotate 90 degrees
                    1,0,0,0 // Rotate 180 degrees
                ],
                type: 'quaternion'
            }
        ],
        uuid: 'xd0a8baa-2226-49b9-989b-3ddfc3051a85',
        clampWhenFinished: true,
        blendMode: 2500
    },
    "zd0a8baa-2226-49b9-989b-3ddfc3051a85": {
        name: 'rotation z',
        duration: 3,
        type: ANIMATION_TYPES.KEYFRAME,
        tracks: [
            {
                name: '.quaternion',
                "times": [0, 0.5, 1],
                "values": [
                    0,0,0,1, // Start at zero rotation
                    0,0.7071,0.7071,0, // Rotate 90 degrees
                    0,0,1,0 // Rotate 180 degrees
                ],
                type: 'quaternion'
            }
        ],
        uuid: 'zd0a8baa-2226-49b9-989b-3ddfc3051a85',
        clampWhenFinished: true,
        blendMode: 2500
    },
    "765258bb-cb65-4107-9f3c-b3ac3a36d8b6":{
        uuid: "765258bb-cb65-4107-9f3c-b3ac3a36d8b6",
        img: pathImg,
        type: ANIMATION_TYPES.PATH,
        name: "Path"

    }
}