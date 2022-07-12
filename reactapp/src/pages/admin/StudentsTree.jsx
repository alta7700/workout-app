import React, {useContext} from 'react';
import ItemsTree from "../../components/tables/tree/ItemsTree";
import StudentCreateForm from "../../components/forms/StudentCreateForm";
import {Context} from "../../index";
import UsersService from "../../api/users";
import useFetching from "../../hooks/useFetching";
import useEffectFetching from "../../hooks/useEffectFetching";

const StudentsTree = () => {

    const {faculties} = useContext(Context)

    const actions = {
        create: {name: "Создать", component: <StudentCreateForm/>},
        bindTeachers: {name: "Установить преподавателей", component: <StudentCreateForm/>}
    }

    const getFaculties = useFetching(async () => {
        const [status, data] = await UsersService.getAvailableFaculties()
        if (status === 200) {
            return data
        }
        return []
    })

    const handleFaculty = useFetching(async (facultyId) => {
        const [status, data] = await UsersService.getFacultyCourses(facultyId)
        if (status === 200) {
            return data
        }
    })

    const handleCourse = useFetching(async (facultyId, courseN) => {
        const [status, data] = await UsersService.getCourseGroups(facultyId, courseN)
        if (status === 200) {
            return data
        }
    })

    const handleGroup = useFetching(async (facultyId, courseN, groupN) => {
        const [status, data] = await UsersService.getGroupStudents(facultyId, courseN, groupN)
        if (status === 200) {
            return data
        }
    })

    useEffectFetching(async () => {
        await faculties.check()
    }, [])
    const nodes = ['facultyId', 'courseN', 'groupN']
    const fields = {
        facultyId: {title: "Факультет", computed: (value) => faculties.get(value)?.shortTitle, handle: handleFaculty},
        courseN: {title: "Курс", handle: handleCourse},
        groupN: {title: "Группа", handle: handleGroup},
        id: {title: "ID", pk: true},
        lastName: {title: "Фамилия"},
        firstName: {title: "Имя"},
        fathersName: {title: "Отчество"},
        username: {title: "Логин"},
        isHead: {title: "Староста", bool: true}
    }

    return (
        <ItemsTree fields={fields} nodes={nodes} actions={actions} rootNodesValues={getFaculties}/>
    );
};

export default StudentsTree;