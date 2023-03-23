import * as Y from "yjs";
import * as _ from "lodash";
import * as THREE from "three";

function getRandom(max, min = 0) {
    return Math.ceil(Math.random() * (max - min) + min);
}

function generateUniqueId() {
    return THREE.MathUtils.generateUUID();
}

function deepSearch(obj, key, keys_list = []) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj.hasOwnProperty(key)) {
        return [...keys_list, key];
    }

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            let result = deepSearch(obj[prop], key);

            if (result !== undefined) {
                return result;
            }
        }
    }
}

function objectToYMap(jsonObject) {
    let map = new Y.Map();
    console.log(jsonObject)
    for (let key of Object.keys(jsonObject)) {
        console.log(key)
        const val = jsonObject[key];
        console.log(val)
        if (typeof (val) == 'object' && !Array.isArray(val) && val !== null) {
            console.log(val)
            map.set(key, objectToYMap(val))
        } else {
            console.log(val)
            map.set(key, val)
        }
    }
    console.log(map)
    return map
}

/**
 *
 * @param arr:Array [[],[]]
 * @param key: key to search the array for
 * @param value: value of the obj[key]
 */

function getIndexAndSubIndex(arr, key, value){
    const result = _.reduce(arr, (acc, subArray, i) => {
        const j = _.findIndex(subArray, (obj) => obj[key] === value);
        if (j !== -1) {
            acc.i = i;
            acc.j = j;
        }
        return acc;
    }, {});

    return result
}


export {getRandom, generateUniqueId, deepSearch, objectToYMap, getIndexAndSubIndex};