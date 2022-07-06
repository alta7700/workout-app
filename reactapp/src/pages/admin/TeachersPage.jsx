import React from 'react';
import TeacherCreateForm from "../../components/forms/TeacherCreateForm";
import TeacherList from "../../components/adminLists/teachers/TeacherList";
import BaseListPage from "./base/BaseListPage";

const TeachersPage = () => {

    return (
        <BaseListPage List={TeacherList} CreateForm={TeacherCreateForm}/>
    );
};

export default TeachersPage;