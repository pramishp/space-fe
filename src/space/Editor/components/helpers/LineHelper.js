import * as React from "react";

import {Box, Line, Plane, useHelper} from "@react-three/drei";
import {LineHelper} from "../../../../common/helpers";
import {useFrame} from "@react-three/fiber";

export function LineHelperComponent({meshRef, points, onClick}) {

    const ref = React.useRef();

    useHelper(meshRef, LineHelper)

    return null
}