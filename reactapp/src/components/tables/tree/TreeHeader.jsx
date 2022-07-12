import React from 'react';

const TreeHeader = ({fields}) => {
    return (
        <thead>
            <tr>
                {Object.entries(fields).map(([name, field]) =>
                    <th key={name}>{field.title}</th>
                )}
            </tr>
        </thead>
    );
};

export default TreeHeader;