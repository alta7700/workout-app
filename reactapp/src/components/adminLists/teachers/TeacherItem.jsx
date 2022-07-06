import React, {useContext} from 'react';
import {Context} from "../../../index";
import BaseItem from "../BaseItem";
import classes from "../BaseList.module.css";

const TeacherItem = ({instance}) => {

    const { subjects } = useContext(Context)

    return (
        <BaseItem
            main={
                <>
                    <h2 className={classes.itemTitle}>{instance.lastName} {instance.firstName} {instance.fathersName}</h2>
                    <h4 className={classes.teacherUname}>
                        {instance.username} (последний вход: {
                        instance.lastLogin ? new Date(instance.lastLogin * 1000).toLocaleString() : "null"
                    })
                    </h4>
                </>
            }
            expand={
                <div className={classes.teacherSubjects}>
                    <h2>Преподаватели</h2>
                    {instance.subjects.map(subjId =>
                        <p key={subjId}>{subjects.getOne(subjId).title}</p>
                    )}
                </div>
            }
        />
    );
};

export default TeacherItem;