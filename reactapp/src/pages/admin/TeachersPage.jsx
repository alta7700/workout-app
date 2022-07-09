import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import ItemList from "../../components/ItemList";
import TeacherCreateForm from "../../components/forms/TeacherCreateForm";
import ActionBar from "../../components/actions/ActionBar";
import useEffectFetching from "../../hooks/useEffectFetching";

const TeachersPage = () => {

    const {teachers} = useContext(Context)
    const [search, setSearch] = useState("")

    useEffectFetching(async () => {
        await teachers.check()
    }, [])

    const fields = {
        id: {title: "ID"},
        lastName: {title: "Фамилия"},
        firstName: {title: "Имя"},
        fathersName: {title: "Отчество"},
        username: {title: "Логин"},
    }
    const actions = {
        create: {name: "Создать", component: <TeacherCreateForm/>},
        add: {name: "Добавить студентов", component: <TeacherCreateForm/>}
    }

    return (
        <>
            <ActionBar search={{value: search, set: setSearch}} actions={actions}/>
            <ItemList itemList={teachers.search(search)} fields={fields} initSort={{"lastName": "asc"}}/>
        </>

    );
};

export default TeachersPage;