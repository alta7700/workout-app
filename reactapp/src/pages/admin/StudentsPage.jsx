import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import useEffectFetching from "../../hooks/useEffectFetching";
import ActionBar from "../../components/actions/ActionBar";
import ItemList from "../../components/ItemList";
import StudentCreateForm from "../../components/forms/StudentCreateForm";
import ItemTree from "../../components/ItemTree";

const StudentsPage = () => {

    const { students, faculties } = useContext(Context)
    const [search, setSearch] = useState("")
    const [asHierarchy, setAsHierarchy] = useState(true)

    useEffectFetching(async () => {
        await students.check()
        await faculties.check()
    }, [])

    const fields = {
        id: {title: "ID"},
        lastName: {title: "Фамилия"},
        firstName: {title: "Имя"},
        fathersName: {title: "Отчество"},
        username: {title: "Логин"},
        facultyId: {title: "Факультет", computed: (value) => faculties.get(value).shortTitle},
        courseN: {title: "Курс"},
        groupN: {title: "Группа"},
        isHead: {title: "Староста", bool: true}
    }

    const actions = {
        create: {name: "Создать", component: <StudentCreateForm/>},
        bindTeachers: {name: "Установить преподавателей", component: <StudentCreateForm/>}
    }

    return (
        <>
            <button onClick={() => setAsHierarchy(prev => !prev)}>Кнопка</button>
            <ActionBar search={{value: search, set: setSearch}} actions={actions}/>
            {asHierarchy
                ? <ItemTree
                    itemList={[...students.list]}
                    fields={fields}
                    nodes={["facultyId", "courseN", "groupN"]}
                />
                : <ItemList
                    itemList={students.search(search)}
                    fields={fields}
                    filters={["facultyId", "courseN", "isHead"]}
                    initSort={{"facultyId": "asc", "courseN": "asc", "groupN": "asc"}}
                />
            }
        </>

    );
};

export default StudentsPage;