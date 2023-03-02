import React, {useState} from "react";
import * as THREE from "three";
import {Box, Flex} from "@react-three/flex";
import {Button} from "./Button";
import {Title} from "./Headings";
import VRUIContainer from "./VRUIContainer";

export function NumberInput({value, onChange}) {


    return (
        <VRUIContainer justifyContent="center" alignItems="center">

            <Box>
                <Title>{`Value: ${value}`}</Title>
            </Box>

            <Button
                onClick={() => {
                    const e = {target: {value: value + 1}}
                    onChange(e)
                }}
                title={"Plus"}
            />

            <Button
                onClick={() => {
                    const e = {target: {value: value - 1}}
                    onChange(e)
                }}
                title={"Minus"}
            />


        </VRUIContainer>
    )
}