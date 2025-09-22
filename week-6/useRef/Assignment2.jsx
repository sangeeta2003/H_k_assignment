import React, { useState, useCallback, useRef } from 'react';

// Create a component that tracks and displays the number of times it has been rendered. Use useRef to create a variable that persists across renders without causing additional renders when it changes.

export function Assignment2() {
    const [count, setCount] = useState(0);
const numberofTimesReRenders = useRef(0);
    const handleReRender = () => {
        // Update state to force re-render
        setCount(count+1)
    };
    numberofTimesReRenders.current = numberofTimesReRenders.current + 1;

    // it always not start from 0 ..it remember its current value 

    return (
        <div>
            <p>This component has rendered {numberofTimesReRenders.current} times.</p>
            <button ref={numberofTimesReRenders} onClick={handleReRender}>Force Re-render</button>
        </div>
    );
};