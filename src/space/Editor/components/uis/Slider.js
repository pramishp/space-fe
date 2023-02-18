
/**
 * It returns a slider component that takes a value
 * and a handleChange(value) function as props
 * @returns A slider component that takes in a value and a handleChange function.
 */
import * as React from 'react';
import * as UISlider from '@mui/material/Slider';

export default function Slider({value, handleChange}) {
    return (
            <UISlider
                size="small"
                defaultValue={value}
                onChange={handleChange}
                aria-label="Small"
                valueLabelDisplay="auto"
            />
    );
}