import React, {useContext} from 'react';
import {Context} from "../../../index";
import BaseItem from "../BaseItem";
import classes from "../BaseList.module.css";

const SubjectItem = ({instance}) => {

    const {teachers} = useContext(Context)
    const findTeachers = (subjID) => {
        return teachers.list.filter(t => subjID in t.subjects)
    }

    return (
        <BaseItem
            main={
                <>
                    <h2 className={classes.itemTitle}>{instance.title} ({instance.shortTitle})</h2>
                </>
            }
            expand={
                <div className={classes.subjectTeachers}>
                    <h2>Преподаватели</h2>
                    {findTeachers(instance.id).map(teacher =>
                        <p key={teacher.id}>{teacher.lastName} {teacher.firstName} {teacher.firstName}</p>
                    )}
                </div>
            }
        />
    );
};

export default SubjectItem;