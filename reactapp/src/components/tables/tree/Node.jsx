import React, {useState} from "react";
import EmptyCells from "./emptyCells";
import ItemRow from "../ItemRow";
import LeafNode from "./LeafNode";

const Node = ({fields, nodes, valuesChain, _depth}) => {

    const [values, setValues] = useState([])
    const [fetched, setFetched] = useState(false)
    const [folded, setFolded] = useState(false)
    const [currentNode, ...nextNodes] = nodes

    const [currentField, nextFields] = (() => {
        const currentField = fields[currentNode]
        const nextFields = {...fields}
        delete nextFields[currentNode]
        return [currentField, nextFields]
    })()

    const getValue = currentField.computed
        ? value => currentField.computed(value)
        : currentField.bool
            ? value => <input type="checkbox" checked={value} readOnly={true}/>
            : value => value

    const onClick = async () => {
        if (fetched) {
            setFolded(prev => !prev)
        } else {
            const data = await currentField.handle(...valuesChain)
            if (data) {
                setValues(data)
                setFetched(true)
                setFolded(true)
            }
        }
    }

    return (
        <>
            <tr onClick={() => onClick()}>
                <EmptyCells count={_depth}/>
                <td>{getValue(valuesChain[valuesChain.length - 1])}</td>
                <EmptyCells count={Object.keys(fields).length-1}/>
            </tr>
            {nextNodes.length > 0
                ? values.map(v =>
                    <Node key={v} fields={nextFields} nodes={nextNodes} valuesChain={[...valuesChain, v]} _depth={_depth+1}/>
                )
                : (folded && <LeafNode fields={nextFields} _depth={_depth+1} valuesChain={[...valuesChain]} arr={values}/>)
            }
        </>
    );
};

export default Node;