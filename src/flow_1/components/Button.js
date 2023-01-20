import {Interactive} from "@react-three/xr";
import {RoundedBox, Text} from "@react-three/drei";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Button(props) {
    const defaultColor = props.defaultColor || 0x777777
    const selectedColor = props.selectedColor || 0x2c4c82
    const hoverColor = props.hoverColor || 0x57a3c9

    const [hover, setHover] = useState(false)
    const [color, setColor] = useState(props.isActive ? selectedColor : defaultColor)

    useEffect(() => {
        setColor(props.isActive ? selectedColor : defaultColor);
    }, [props.isActive])

    function onSelect() {
        // setColor(0xffffff);
        // props.onSelect();

        if (props.onSelect) {
            props.onSelect();
        }

    }

    function onHover() {
        setColor(hoverColor);
        setHover(true);
        if (props.onHover) {
            props.onHover();
        }
    }

    function onBlur() {
        setColor(props.isActive ? selectedColor : defaultColor);
        setHover(false);
        if (props.onBlur) {
            props.onBlur();
        }
    }

    // function onSelectStart() {
    //     setColor(selectedColor);
    // }
    //
    // function onSelectEnd() {
    //     setColor((props.isActive ?? selectedColor) || defaultColor);
    // }

    return (
        <Interactive
            onSelect={onSelect}
            // onSelectStart={onSelectStart}
            // onSelectEnd={onSelectEnd}
            onHover={onHover}
            onBlur={onBlur}

        >
            <RoundedBox
                {...props}
                radius={0.009}
                args={[0.4, 0.1, props.isActive ? 0.01 : 0.05]}
                scale={hover ? 1.12 : 1}
            >
                <meshStandardMaterial
                    color={color}
                />
                <Text
                    position={[0, 0, props.isActive ? 0.006 : 0.05 / 2 + 0.001]}
                    fontSize={0.05}
                    color="#fff"
                    anchorX="center"
                    anchorY="middle"
                >
                    {props.label}
                </Text>
            </RoundedBox>
        </Interactive>
    )
}

Button.propTypes = {
    onSelect: PropTypes.func,
    onHover: PropTypes.func,
    onBlur: PropTypes.func,
    label: PropTypes.string,
    isActive: PropTypes.bool,
    defaultColor: PropTypes.number,
    selectedColor: PropTypes.number,
    hoverColor: PropTypes.number,
}