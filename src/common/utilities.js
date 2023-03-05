
/**
 * It takes a Float32Array and returns an array of Vector3 objects
 * @param floatArray - The Float32Array that contains the data
 * @returns An array of Vector3 objects.
 */
import * as THREE from "three";

export function float32Array2Vector3(floatArray){

// Create an empty array for Vector3 objects
    var vectorArray = [];

// Loop over the Float32Array with a step of 3
    for (var i = 0; i < floatArray.length; i += 3) {
        // Create a Vector3 object with three float values
        var vector = new THREE.Vector3(floatArray[i], floatArray[i + 1], floatArray[i + 2]);

        // Push the vector to the array
        vectorArray.push(vector);
    }

    return vectorArray;
}