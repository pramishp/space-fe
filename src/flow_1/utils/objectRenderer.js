import {ObjectTypes} from "../constants/constants";

export function renderObject(object) {
    switch (object.type) {
        case ObjectTypes.Basic:
            renderBasic(object);
            break;
        case ObjectTypes.Obj:
            renderObj(object);
            break;
        default:
            return
    }
}

function renderBasic(object) {

}

function renderObj(object) {

}