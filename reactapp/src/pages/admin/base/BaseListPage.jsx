import React, {useRef, useState} from 'react';
import SubmitButton from "../../../components/forms/base/SubmitButton";
import classes from "./ListPage.module.css";
import classNames from "classnames";

const BaseListPage = ({List, CreateForm}) => {

    const [search, setSearch] = useState("")
    const [visibleCreateForm, setVisibleCreateForm] = useState(false)
    const formRef = useRef()

    return (
        <>
            <div className={classes.top}>
                <input
                    type="search"
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Поиск..."
                    className={classes.search}
                />
                <SubmitButton type={'button'} onClick={() => setVisibleCreateForm(true)}>Создать</SubmitButton>
            </div>
            <div
                ref={formRef}
                className={visibleCreateForm ? classes.form_background : classNames(classes.form_background, classes.hidden)}
                onClick={(e) => e.target === formRef.current && setVisibleCreateForm(false)}
            >
                <CreateForm visible={visibleCreateForm} setVisible={setVisibleCreateForm}/>
            </div>
            <List search={search}/>
        </>
    );
};

export default BaseListPage;