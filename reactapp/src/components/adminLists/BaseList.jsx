import React, {useContext, useEffect} from 'react';
import useFetching from "../../hooks/useFetching";
import {Context} from "../../index";
import classes from "./BaseList.module.css";

const BaseList = ({itemList, ItemComponent}) => {

    const {teachers, subjects} = useContext(Context)
    const checkTeachers = useFetching(async () => {
        await teachers.check()
        await subjects.check()
    })

    useEffect(() => {
        checkTeachers()
    }, [])

    return (
        <>
            <div className={classes.list}>
                {itemList.map(item =>
                    <ItemComponent key={item.id} instance={item}/>
                )}
            </div>
        </>
    );
};

export default BaseList;