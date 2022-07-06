import React, {useContext} from 'react';
import {Context} from "../../index";
import BaseListPage from "./base/BaseListPage";
import StudentList from "../../components/adminLists/students/StudentList";
import StudentItem from "../../components/adminLists/students/StudentItem";

const StudentsPage = () => {

    const { students } = useContext(Context)


    return (
        <BaseListPage List={StudentList} CreateForm={StudentItem}/>
    );
};

export default StudentsPage;