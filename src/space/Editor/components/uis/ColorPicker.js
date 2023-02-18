/**
 * It's a React component that renders a color picker, and when the color is changed,
 * it calls the `handleChange(color)` function
 * with the new color
 * @returns A color picker component that takes in a color and a handleChange function as props.
 */
import React from 'react'
import { MuiColorInput } from 'mui-color-input'

export const ColorPicker = ({color, handleChange}) => {

    return (
        <MuiColorInput value={color} onChange={handleChange} />
    )
}