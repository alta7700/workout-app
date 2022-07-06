import React, {useContext} from 'react';
import BaseList from "../BaseList";
import {Context} from "../../../index";
import TeacherItem from "./TeacherItem";

const TeacherList = ({search}) => {

    const {teachers} = useContext(Context)

    const filterTeachers = () => {
        let filtered = [...teachers.list]
        if (search) {
            search.toLowerCase().split(" ").map(frag =>
                filtered = filtered.filter(t =>
                    t.lastName.toLowerCase().startsWith(frag) ||
                    t.firstName.toLowerCase().startsWith(frag) ||
                    t.fathersName.toLowerCase().startsWith(frag)
                )
            )
        }
        return filtered
    }

    return (
        <BaseList itemList={filterTeachers()} ItemComponent={TeacherItem}/>
    );
};

export default TeacherList;