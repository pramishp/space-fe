import React from 'react';
import './NameCircle.css';

function NameCircle({ first, last }) {

    return (
        <div className="name-circle">
            <div className="letter">{first.charAt(0).toUpperCase()}</div>
            <div className="letter">{last.charAt(0).toUpperCase()}</div>
        </div>
    );
}

export default NameCircle;
