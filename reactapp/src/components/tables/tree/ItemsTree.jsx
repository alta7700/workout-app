import React, {useEffect, useState} from 'react';
import classes from "../ItemTables.module.css";
import ActionBar from "../../actions/ActionBar";
import TreeHeader from "./TreeHeader";
import Node from "./Node";

const ItemsTree = ({fields, nodes, actions, rootNodesValues}) => {

    const [rootNodes, setRootNodes] = useState([])

    useEffect(() => {
        (async () => {
            const nodes = await rootNodesValues()
            setRootNodes(nodes)
        })()
    }, [])

    return (
        <>
            <ActionBar actions={actions}/>
            <table className={classes.table}>
                <TreeHeader fields={fields}/>
                <tbody>
                    {rootNodes.map(value =>
                        <Node key={value} nodes={nodes} valuesChain={[value]} fields={fields} _depth={0}/>
                    )}
                </tbody>
            </table>
        </>
    );
};


export default ItemsTree;