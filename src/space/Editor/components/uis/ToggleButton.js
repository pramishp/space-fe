/**
 * It returns a Material UI ToggleButton component that toggles the value of the `value` prop and calls the `handleChange`
 * prop with the new value
 * @returns A ToggleButton component that is either checked or unchecked.
 */
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import * as ToggleButtonUI from '@mui/material/ToggleButton';

export default function ToggleButton({value, handleChange}) {

    return (
        <ToggleButtonUI
            value="check"
            selected={value}
            onChange={() => {
                handleChange(!value);
            }}
        >
            <CheckIcon />
        </ToggleButtonUI>
    );
}