import * as _ from "lodash";
import * as THREE from "three";
import {AnimationClip} from "three";
import {getIndexAndSubIndex} from "../utils";
import {ANIMATION_LIFE_TYPES} from "../common/consts";
import {ANIMATION_TYPES} from "./Editor/constants";


export default class AnimationSequence {

    /**
     * @param onAnimationEnd: it is function with params {e, index, subIndex} that is called when animation completes of an order
     * */

    constructor({meshRefs, slides, animations}, onAnimationEnd) {
        this.meshRefs = meshRefs;
        this.slides = slides
        this.animationsJson = animations;
        this.state = {}

        // sequence is the main str holding all the sequences, it also sets slideAnimations
        this.sequence = this.getSequence(slides);
        this.length = this.sequence.length;
        this.initialized = false;
        this.onAnimationEnd = onAnimationEnd;

    }


    updateRefs(refs) {
        // console.log(refs)
        this.meshRefs = refs
    }

    setSlideAnimations(slideAnimations){
        this.slideAnimations = slideAnimations;

    }

    init() {
        // this.slideAnimations is set by getSequence
        this.mixers = this.getMixers(this.slideAnimations, this.meshRefs);
        this.parsedAnimations = this.parseAnimations(this.slideAnimations, this.animationsJson, this.meshRefs);
        // listeners contain all the on animation end callbacks, they have to be unsubscribed
        const {clipActions, listeners} = this.getClipActions(this.slideAnimations, this.mixers,
            this.sequence, this.parsedAnimations, this.animationsJson)
        this.clipActions = clipActions;
        this.listeners = listeners;
        this.currentIndex = -1;
        this.initialized = true;
    }


    /**
     * Generates a sequence str from slideAnimations
     * [[{},{}],[{}]]
     * */
    getSequence(slides) {
        // get current slide
        //TODO: handle slide index
        const slides_list = _.orderBy(slides, ['order'], ['asc'])
        const currentSide = slides_list[0];

        const slide_animations = currentSide['animations']
        this.setSlideAnimations(slide_animations);
        // group animations by order and make a list
        const animation_group = _.groupBy(slide_animations, 'order')

        function orderAnimationGroup(item) {
            return parseInt(item[0]['order'])
        }

        // animation_seq is like [[{},{}],[{}]] this format. Where the outer list
        // is the order number and the inner list is the animations to be played simultaneously
        const animation_seq = _.orderBy(animation_group, [orderAnimationGroup], ['asc'])
        return animation_seq
    }

    /**
     * create threejs AnimationMixer for each mesh that has animation
     * */
    getMixers(slideAnimations, meshRefs) {
        // create mixer for each object that has animation
        // console.log(meshRefs)
        // console.log('inside get mixers',this.meshRefs[Object.keys(this.meshRefs)[0]].current)

        const mixers = {}
        const allMeshes = Object.entries(slideAnimations).map(([uuid, val]) => val.object_uuid)
        const uniqueMeshes = new Set(allMeshes);
        uniqueMeshes.forEach((uuid) => {
            const meshRef = meshRefs[uuid]
            mixers[uuid] = new THREE.AnimationMixer(meshRef.current)
        })
        return mixers

    }


    /**
     * creates Threejs clipActions for each item in slideAnimations
     *
     */
    getClipActions(slideAnimations, mixers, animationSeq, parsedAnimations, animationsJson) {
        // assign clip actions from parsed animations
        const clipActions = {}
        const listeners = {}

        function onAnimationFinished(e, index, subIndex) {
            console.log('on animation finished', e)
            console.log(this.onAnimationEnd)

        }

        Object.entries(slideAnimations).forEach(([uuid, val]) => {
            // get mesh/object specific mixer
            const mixer = mixers[val.object_uuid];
            // const clip = animations[val.animation_uuid];
            // create new animation for each animation of slide_animation
            const clip = parsedAnimations[uuid]
            // each slide animation is a clip action
            clipActions[uuid] = mixer.clipAction(clip);

            // set timescale
            clipActions[uuid].timeScale = parseFloat(val.timeScale);
            // listeners are mixer based i.e. one listener for one animated mesh
            if (listeners[val.object_uuid] === undefined) {
                listeners[val.object_uuid] = (e) => {
                    /**
                     * Finds the longest animation of its order and attaches the onAnimationFinished to it,
                     * if there are animation of type INFINITY, it is ignore. INFINITY  types are handled in play function
                     * */
                    const animation_uuid = e.action._clip.uuid;
                    const slide_animation_uuid = e.action.slide_animation_uuid;
                    const {type: animationType, trigger: animationTrigger} = e.action;
                    // find index and subIndex of slide_animation in animation_seq
                    const {i, j} = getIndexAndSubIndex(animationSeq, "uuid", slide_animation_uuid)

                    // attach onAnimationEnd only if it is the longest animation of that index
                    // if there is an animation with type INFINITY, ignore it
                    const sortedSlideAnimations = animationSeq[i].filter(function (i) {
                        return (i.type !== ANIMATION_LIFE_TYPES.INFINITY)
                    }).map(item => animationsJson[item.animation_uuid]).sort(function (a, b) {
                        return b.duration - a.duration;
                    })

                    //make sure the sublist doesn't contain only INFINITY type animations
                    if (sortedSlideAnimations.length >= 1) {
                        const longestAnimationUUID = sortedSlideAnimations[0].uuid
                        if (animation_uuid === longestAnimationUUID) {
                            // onAnimationFinished(e, i, j);
                            if (this.onAnimationEnd) {
                                this.onAnimationEnd(e, i, j)
                            }
                        }
                    }
                }
                if (val.type === THREE.LoopOnce) {
                    mixer.addEventListener('finished', listeners[val.object_uuid])
                }
            }

        })
        return {clipActions, listeners}

    }

    parseAnimations(slideAnimations, animationsJson, meshRefs) {
        const parsedAnimations = {}
        Object.entries(slideAnimations).forEach(([uuid, val]) => {
            if (val.animationType === ANIMATION_TYPES.KEYFRAME){
                parsedAnimations[uuid] = AnimationClip.parse(animationsJson[val.animation_uuid])
            } else if (val.animationType === ANIMATION_TYPES.PATH){
                // get coordinates of the path and make keyframe animation out of it
                const path_uuid = animationsJson[val.animation_uuid].path_uuid;
                const pathRef = meshRefs[path_uuid];
                if (!pathRef.current){
                    console.error(`PathRef with uuid ${path_uuid} is null`)
                }
                const path = pathRef.current;
                const pathWorldCoordinates = path.geometry.clone().applyMatrix4(path.matrixWorld);

                const positionsAttribute = pathWorldCoordinates.getAttribute('position');
                const numKeyframes = positionsAttribute.count;
                const keyframeTimes = new Array(numKeyframes);

                for (let i = 0; i < numKeyframes; i++) {
                    keyframeTimes[i] = i / (numKeyframes - 1);
                }

                const positionArray = new Array(numKeyframes * 3);

                for (let i = 0; i < numKeyframes; i++) {
                    const index = i * 3;
                    const x = positionsAttribute.getX(i);
                    const y = positionsAttribute.getY(i);
                    const z = positionsAttribute.getZ(i);
                    positionArray[index] = x;
                    positionArray[index + 1] = y;
                    positionArray[index + 2] = z;
                }

                const trackName = '.position'; // name of the property to animate
                const track = new THREE.VectorKeyframeTrack(trackName, keyframeTimes , positionArray); // create a track
                const clip = new THREE.AnimationClip('positionChange', -1 , [track]);
                // clip.timeScale = -2.0;
                // console.log('keyframe animation', clip)
                parsedAnimations[uuid] = clip
            } else {

            }
        })
        return parsedAnimations;
    }

    /**
     * *
     * Takes a list of animations and plays it at once
     * @param index: index to be played
     */

    playAnimations(index) {
        // currentIndex is the last time played animations order
        this.currentIndex = index;
        const animations_seq = this.sequence;
        const clipActions = this.clipActions;

        if (index > (animations_seq.length - 1)) {
            console.error("Animation Seq Index Out of Bound")
        }

        // play each animation of that index/order
        animations_seq[index].forEach(animation => {
            let action = clipActions[animation.uuid];
            action.clampWhenFinished = true;
            action.slide_animation_uuid = animation.uuid;
            action.type = animation.type;
            action.trigger = animation.trigger;

            if (animation.type === ANIMATION_LIFE_TYPES.LOOP_ONCE) {
                action.loop = THREE.LoopOnce;
            }
            if (animation.type === ANIMATION_LIFE_TYPES.INFINITY) {
                action.loop = THREE.LoopRepeat;
            }
            action.reset();
            action.play();
        })

        // if there is no animation with LOOP_ONCE type in index/order,
        // play it and immediately call the next animation
        let hasLoopOnce = false;
        animations_seq[index].forEach(animation => {
            if (animation.type !== ANIMATION_LIFE_TYPES.INFINITY) {
                hasLoopOnce = true;
            }
        })

        if (index < animations_seq.length - 1 && !hasLoopOnce) {
            // console.log('all infinity animation, playing next', animation_seq[index + 1])
            this.playAnimations(index + 1)
        }

    }

    playNextAnimations(){
        if (this.currentIndex < this.length){
           this.playAnimations(this.currentIndex + 1)

        }
    }

    prev(){
        if (this.currentIndex > 0){
            //TODO: revert state to before state
        }
    }

    getNextActionTrigger(){
        if (this.currentIndex < this.length){
            const nextAnimations = this.sequence[this.currentIndex + 1]
            const singleAnimation = nextAnimations[0]
            return singleAnimation.trigger

        }
        return null

    }

}