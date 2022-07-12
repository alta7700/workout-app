import React from 'react';

const EmptyCells = ({count, className}) => {

    const emptyCells = () => {
        let offsetArray = new Array(count)
        for (let i = 0; i < count; i++) {
            offsetArray.push(i)
        }
        return offsetArray
    }

    return (
        <>
            {emptyCells().map(_ =>
                <td key={_} className={className}></td>
            )}
        </>
    );
};

export default EmptyCells;