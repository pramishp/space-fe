import {Interactive, RayGrab} from "@react-three/xr";
import {RoundedBox, Text} from "@react-three/drei";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";

export default function Button(props) {
    const defaultColor = props.defaultColor || 0x777777
    const selectedColor = props.selectedColor || 0x2c4c82
    const hoverColor = props.hoverColor || 0x57a3c9

    const [hover, setHover] = useState(false)
    const [color, setColor] = useState(props.isActive ? selectedColor : defaultColor)

    useEffect(() => {
        setColor(props.isActive ? selectedColor : defaultColor);
    }, [props.isActive])

    function onSelect(e) {
        // setColor(0xffffff);
        // props.onSelect();

        if (props.onSelect) {
            props.onSelect(e);
        }

    }

    function onHover(e) {
        setColor(hoverColor);
        setHover(true);
        if (props.onHover) {
            props.onHover(e);
        }
    }

    function onBlur(e) {
        setColor(props.isActive ? selectedColor : defaultColor);
        setHover(false);
        if (props.onBlur) {
            props.onBlur(e);
        }
    }

    function onSelectStart(e){
        if (props.onSelectStart) {
            props.onSelectStart(e);
        }
    }

    function onSelectEnd(e) {
        if (props.onSelectEnd) {
            props.onSelectEnd(e);
        }
    }

    return (
        <group>
            <Wrapper
                rayGrab={props.canGrab}
                onSelect={onSelect}
                onSelectStart={onSelectStart}
                onSelectEnd={onSelectEnd}
                onHover={onHover}
                onBlur={onBlur}

            >
                <RoundedBox
                    {...props}
                    radius={props.radius ?? 0.009}
                    args={props.args ?? [0.4, 0.1, props.isActive ? 0.01 : 0.05]}
                    scale={hover ? 1.12 : 1}
                >
                    <meshStandardMaterial
                        color={color}
                    />
                    <Text
                        position={[0, 0, props.isActive ? 0.006 : 0.05 / 2 + 0.001]}
                        fontSize={props.fontSize ?? 0.05}
                        color="#fff"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {props.label}
                    </Text>
                </RoundedBox>
            </Wrapper>
        </group>

    )
}

function Wrapper(props) {
    return (
        <>

            {props.rayGrab ?
                <RayGrab
                    onSelect={props.onSelect}
                    onSelectStart={props.onSelectStart}
                    onSelectEnd={props.onSelectEnd}
                    onHover={props.onHover}
                    onBlur={props.onBlur}
                >
                    {props.children}
                </RayGrab> :
                <Interactive
                    onSelect={props.onSelect}
                    onSelectStart={props.onSelectStart}
                    onSelectEnd={props.onSelectEnd}
                    onHover={props.onHover}
                    onBlur={props.onBlur}
                >
                    {props.children}
                </Interactive>
            }
        </>
    )
}

Button.propTypes = {
    onSelect: PropTypes.func,
    onHover: PropTypes.func,
    onBlur: PropTypes.func,
    onSelectStart: PropTypes.func,
    onSelectEnd: PropTypes.func,
    label: PropTypes.string,
    fontSize: PropTypes.number,
    radius: PropTypes.number,
    args: PropTypes.array,
    isActive: PropTypes.bool,
    defaultColor: PropTypes.number,
    selectedColor: PropTypes.number,
    hoverColor: PropTypes.number,
    canGrab: PropTypes.bool,
}


Wrapper.propTypes = {
    rayGrab: PropTypes.bool,
    onSelect: PropTypes.func,
    onHover: PropTypes.func,
    onBlur: PropTypes.func,
    onSelectStart: PropTypes.func,
    onSelectEnd: PropTypes.func,
}