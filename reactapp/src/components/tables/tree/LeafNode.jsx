import React, {useState} from 'react';
import ItemRow from "../ItemRow";
import EmptyCells from "./emptyCells";

const LeafNode = ({fields, valuesChain, arr, _depth}) => {

    return (
        <>
            {arr.map(instance =>
                <tr key={instance.id}>
                    <EmptyCells count={_depth}/>
                    <ItemRow instance={instance} fields={fields}/>
                </tr>
            )}
        </>
    );
}


export default LeafNode;