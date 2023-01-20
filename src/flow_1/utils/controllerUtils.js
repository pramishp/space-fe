export const ControllerType = {
    0: 'Left',
    1: 'Right',
}

export function getControllerType(target) {
    return ControllerType[target.index].toLowerCase()
}
