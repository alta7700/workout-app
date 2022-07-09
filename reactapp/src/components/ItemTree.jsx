import React, {useState} from 'react';
import classes from "./ItemList.module.css";
import ItemRow from "./ItemRow";

const ItemTree = ({itemList, nodes, fields}) => {

    function validateValue(value) {
        value.toLowerCase && (value = value.toLowerCase())
        return value
    }
    function sorter(a, b) {
        let num
        for (let field of nodes) {
            let aValue = validateValue(a[field])
            let bValue = validateValue(b[field])
            num = (bValue < aValue) - (aValue < bValue)
            if (num !== 0) {
                return num
            }
        }
        return 0
    }

    function getTreeFields() {
        let newFields = {}
        let oldFields = {...fields}
        for (let f of nodes) {
            newFields[f] = oldFields[f]
            delete oldFields[f]
        }
        return {...newFields, ...oldFields}
    }
    const orderedFields = getTreeFields()

    function getNodesKeys(arr, fieldName) {
        let values = []
        for (let item of arr) {
            let fieldValue = item[fieldName]
            !values.some((v) => v === fieldValue) && values.push(fieldValue)
        }
        values.sort((a, b) => (b < a) - (a < b))
        return values
    }

    function buildNodes(nodesFields, arr, depth) {
        let nodeField = nodesFields.shift()
        let node = {_fieldName: nodeField, _depth: depth}
        let keys = getNodesKeys(arr, nodeField)
        for (let key of keys) {
            let subArr = arr.filter(v => v[nodeField] === key)
            if (nodesFields.length !== 0) {
                node[key] = buildNodes([...nodesFields], subArr, depth + 1)
            } else {
                node[key] = subArr
            }
        }
        return node
    }

    function makeTree() {
        let arr = [...itemList].sort(sorter)
        return buildNodes([...nodes], arr, 0)
    }
    return (
        <table className={classes.table}>
            <thead>
            <tr>
                {Object.entries(orderedFields).map(([name, field]) =>
                    <th key={name}>{field.title}</th>
                )}
            </tr>
            </thead>
            <tbody>
                <TreeNode fields={orderedFields} {...makeTree()}/>
            </tbody>
        </table>
    );
};

const emptyCells = (len) => {
    let offsetArray = new Array(len)
    for (let i = 0; i < len; i++) {
        offsetArray.push(i)
    }
    return offsetArray
}

const TreeNode = ({fields, _fieldName, _depth, ...treeNode}) => {

    return (
        <>
            {Object.entries(treeNode).map(([value, node]) =>
                <NodeRow key={value} _fieldName={_fieldName} value={value} fields={fields} _depth={_depth} node={node}/>
            )}
        </>
    );
};

const NodeRow = ({_fieldName, fields, value, _depth, node}) => {

    const f = (() => {
        let newFields = {...fields}
        delete newFields[_fieldName]
        return newFields
    })()

    const [folded, setFolded] = useState(false)

    return (
        <>
            <tr onClick={() => setFolded(prev => !prev)}>
                {emptyCells(_depth).map(_ =>
                    <td key={_}></td>
                )}
                <td>{value}</td>
                {emptyCells(Object.keys(fields).length-1).map(_ =>
                    <td key={_}></td>
                )}
            </tr>
            {folded && (Object.prototype.toString.call(node) === '[object Object]'
                ? <TreeNode fields={f} {...node}/>
                : <LeafNode fields={f} arr={node} _depth={_depth+1}/>)}
        </>
    );
};


const LeafNode = ({fields, arr, _depth}) => {
    return (
        <>
            {arr.map(instance =>
                <tr key={instance.id}>
                    {emptyCells(_depth).map(_ =>
                        <td key={_}></td>
                    )}
                    <ItemRow instance={instance} fields={fields}/>
                </tr>
            )}
        </>
    );
}


export default ItemTree;