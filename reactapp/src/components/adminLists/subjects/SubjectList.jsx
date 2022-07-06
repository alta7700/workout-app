import React, {useContext} from 'react';
import {Context} from "../../../index";
import BaseList from "../BaseList";
import SubjectItem from "./SubjectItem";

const SubjectList = ({search}) => {

    const { subjects } = useContext(Context)

    const filterSubjects = () => {
        let filtered = [...subjects.list]
        if (search) {
            search.toLowerCase().split(" ").map(frag =>
                filtered = filtered.filter(s =>
                    s.title.toLowerCase().includes(frag) ||
                    s.shortTitle.toLowerCase().includes(frag)
                )
            )
        }
        return filtered
    }

    return (
        <BaseList itemList={filterSubjects()} ItemComponent={SubjectItem}/>
    );
};

export default SubjectList;