import {ANIMATION_TYPES} from "../../constants";

export const animations = {
    'd7fbf2ba-b04c-4f59-acbd-6c5563d8b53d': {
        name: 'position',
        duration: 3,
        type: ANIMATION_TYPES.KEYFRAME,
        tracks: [
            {
                name: '.position',
                times: [0, 1, 2],
                values: [
                    2, 0, 0, 3, 0,
                    0, 2, 0, 0
                ],
                type: 'vector'
            }
        ],
        uuid: 'd7fbf2ba-b04c-4f59-acbd-6c5563d8b53d',
        blendMode: 2500
    },
    'd77c5fc4-f70b-4ec3-ace7-3dd187185451': {
        name: 'scale',
        duration: 3,
        type: ANIMATION_TYPES.KEYFRAME,
        tracks: [
            {
                name: '.scale',
                times: [0, 1, 2],
                values: [
                    1, 1, 1, 2, 2,
                    2, 1, 1, 1
                ],
                type: 'vector'
            }

        ],
        uuid: 'd77c5fc4-f70b-4ec3-ace7-3dd187185451',
        blendMode: 2500
    },
    "fc0a8baa-2226-49b9-989b-3ddfc3051a84": {
        name: 'rotation',
        duration: 3,
        type: ANIMATION_TYPES.KEYFRAME,
        tracks: [
            {
                name: '.quaternion',
                times: [0, 1, 2],
                values: [0, 0, 0, 1, 1, 0, 0, 6.123234262925839e-17, 0, 0, 0, 1],
                type: 'quaternion'
            }

        ],
        uuid: 'fc0a8baa-2226-49b9-989b-3ddfc3051a84',
        clampWhenFinished: true,
        blendMode: 2500
    },
    "765258bb-cb65-4107-9f3c-b3ac3a36d8b6":{
        uuid: "765258bb-cb65-4107-9f3c-b3ac3a36d8b6",

    }


}