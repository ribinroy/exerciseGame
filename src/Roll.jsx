import React, { useState } from 'react';

export default function Roll() {
    const [selecteditem, setItem] = useState(false);

    function selectItem(item) {
        setItem(item);
    }

    return (
        <div className='roller'>
            <div className='item' onClick={() => selectItem('1')}>
                1
            </div>
            <div className='item' onClick={() => selectItem('1')}>
                2
            </div>
            <div className='item' onClick={() => selectItem('1')}>
                3
            </div>
        </div>
    );
}
