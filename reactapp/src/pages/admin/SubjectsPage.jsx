import React from 'react';
import SubjectCreateForm from "../../components/forms/SubjectCreateForm";
import SubjectList from "../../components/adminLists/subjects/SubjectList";
import BaseListPage from "./base/BaseListPage";

const SubjectsPage = () => {

    return (
        <BaseListPage List={SubjectList} CreateForm={SubjectCreateForm}/>
    );
};

export default SubjectsPage;