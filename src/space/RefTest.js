import React, { useRef } from 'react';

export function MyComponent() {
    const componentRef = useRef(null);

    const handleClick = () => {
        componentRef.current.methodInMyComponent();
    };

    return (
        <div>
            <ChildComponent ref={componentRef} />
            <button onClick={handleClick}>Call ChildComponent's Method</button>
        </div>
    );
}

class ChildComponent extends React.Component {
    methodInMyComponent() {
        console.log('method in ChildComponent is called');
    }

    render() {
        return <div>Child Component</div>;
    }
}
