import React, {useContext, useState, useEffect} from 'react';
import {Context} from "../../index";
import {useForm} from "react-hook-form";
import useFetching from "../../hooks/useFetching";
import BaseForm from "./base/BaseForm";
import TextInput from "./base/TextInput";
import SubmitButton from "./base/SubmitButton";
import SubjectsService from "../../api/subjects";

const SubjectCreateForm = ({visible, setVisible}) => {

    const {subjects} = useContext(Context)
    const {register, reset, formState: { errors }, handleSubmit} = useForm({
        mode: 'onChange',
        criteriaMode: "all",
    })
    const [formError, setFormError] = useState('')
    const onSubmit = useFetching(async (data) => {
        let [status, info] = await SubjectsService.create(data.title, data.shortTitle)
        if (status === 201) {
            await subjects.update()
            setVisible(false)
        } else if (status === 400) {
            setFormError(info.detail)
        }
    })

    useEffect(() => { visible && reset() }, [visible])

    return (
        <BaseForm title="Добавить предмет" formError={formError} onSubmit={handleSubmit(onSubmit)}>
            <TextInput register={register("title")} label="Название" errors={errors.title}/>
            <TextInput register={register("shortTitle")} label="Аббревиатура" errors={errors.shortTitle}/>
            <SubmitButton>Создать</SubmitButton>
        </BaseForm>
    );
};

export default SubjectCreateForm;