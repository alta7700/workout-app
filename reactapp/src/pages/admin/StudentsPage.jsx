import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import useEffectFetching from "../../hooks/useEffectFetching";
import StudentCreateForm from "../../components/forms/StudentCreateForm";
import useTable from "../../components/tables/table/useTable";
import UsersService from "../../api/users";
import useDebounceFetching from "../../hooks/useDebounceFetching";

const StudentsPage = () => {

    const { faculties } = useContext(Context)

    const [studentsList, setStudentsList] = useState([])
    const [availableFilters, setAvailableFilters] = useState({})
    const [firstFetching, setFirstFetching] = useState(true)
    const actions = {
        create: {name: "Создать", component: <StudentCreateForm/>},
        bindTeachers: {name: "Установить преподавателей", component: <StudentCreateForm/>}
    }
    const fields = {
        id: {title: "ID", pk: true},
        lastName: {title: "Фамилия"},
        firstName: {title: "Имя"},
        fathersName: {title: "Отчество"},
        username: {title: "Логин"},
        facultyId: {title: "Факультет", computed: (value) => faculties.get(value)?.shortTitle},
        courseN: {title: "Курс"},
        groupN: {title: "Группа"},
        isHead: {title: "Староста", bool: true}
    }
    const limit = 50

    const {
        search,
        sort,
        filters,
        selected, setSelected,
        activePage, setActivePage, setPagesCount,
        Table
    } = useTable({
        itemList: studentsList,
        fields,
        actions,
        availableFilters,
    })

    useEffectFetching(async () => {
        await faculties.check()
    }, [])

    const loadTable = async (page) => {
        let params = {page, limit}
        if (search) {
            params["q"] = search
        }
        if (Object.keys(sort).length > 0) {
            let sorting = []
            for (let [field, dir] of Object.entries(sort)) {
                sorting.push(dir === "asc" ? field : `-${field}`)
            }
            params["order"] = sorting
        }
        if (Object.keys(filters).length > 0) {
            params["filters"] = filters
        }
        const [status, data] = await UsersService.getStudents(params)
        if (status === 200) {
            setStudentsList(data.students)
            setPagesCount(Math.ceil(data.count / limit))
            setAvailableFilters(data.filters)
        }
    }
    const loadTableDebounce = useDebounceFetching(async (page, pageChanged) => {
        await loadTable(page)
        if (!pageChanged) {
            setActivePage({page: 1, firstTime: true})
        }
    }, 500)

    useEffect(() => {
        if (!firstFetching && !activePage.firstTime) {
            loadTableDebounce(activePage.page, true)
        }
    }, [activePage])

    useEffect(() => {
        if (!firstFetching) {
            loadTableDebounce(1, false)
        }
    }, [search, sort, filters])

    useEffectFetching(async () => {
        await loadTable(1)
        setFirstFetching(false)
    }, [])

    return (
        <>{Table}</>
    );
};

export default StudentsPage;