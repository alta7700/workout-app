import React, {useContext, useState} from 'react';
import SubjectCreateForm from "../../components/forms/SubjectCreateForm";
import {Context} from "../../index";
import ActionBar from "../../components/actions/ActionBar";
import ItemList from "../../components/tables/table/ItemList";
import useEffectFetching from "../../hooks/useEffectFetching";

const SubjectsPage = () => {

    const { subjects } = useContext(Context)
    const [search, setSearch] = useState("")

    useEffectFetching(async () => {
        await subjects.check()
    }, [])


    const fields = {
        id: {title: "ID"},
        title: {title: "Название"},
        shortTitle: {title: "Сокращение"}
    }

    const actions = {
        create: {name: "Создать", component: <SubjectCreateForm/>},
    }

    return (
        <>
            <ActionBar search={{value: search, set: setSearch}} actions={actions}/>
            <ItemList itemList={subjects.search(search)} fields={fields}/>
        </>

    );
};

export default SubjectsPage;