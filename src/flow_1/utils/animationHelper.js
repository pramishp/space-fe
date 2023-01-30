export const orbitCalculation = function (radius) {
    return {
        x: (Math.sin((Date.now() % 60000) / 60000 * Math.PI * 2) * radius),
        z: (Math.cos((Date.now() % 60000) / 60000 * Math.PI * 2) * radius)
    };
}