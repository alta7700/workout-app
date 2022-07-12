import React from 'react';

const ItemRow = ({instance, fields}) => {
    return (
        <>
            {Object.entries(fields).map(([name, field]) =>
                <td key={name}>
                    {field.computed
                        ? field.computed(instance[name])
                        : field.bool
                            ? <input type="checkbox" checked={instance[name]} readOnly={true}/>
                            : instance[name]}
                </td>
            )}
        </>
    );
};

export default ItemRow;