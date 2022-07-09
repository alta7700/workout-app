import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {useForm} from "react-hook-form";
import useFetching from "../../hooks/useFetching";
import PasswordInput from "./base/PasswordInput";
import UsernameInput from "./base/UsernameInput";
import BaseForm from "./base/BaseForm";
import SubmitButton from "./base/SubmitButton";
import TextInput from "./base/TextInput";

const TeacherCreateForm = () => {

    const {auth, teachers} = useContext(Context)
    const {register, resetField, getValues, formState: { errors }, handleSubmit} = useForm({
        mode: 'onChange',
        criteriaMode: "all",
    })
    const [formError, setFormError] = useState('')
    const onSubmit = useFetching(async (data) => {
        const [code, info] = await auth.registerTeacher(
            data.username, data.password, data.rePassword, data.firstName, data.lastName, data.fathersName
        );
        if (code === 201) {
            await teachers.update()
        } else {
            resetField("password", {keepDirty: false, keepError: false, keepTouched: false})
            resetField("rePassword", {keepDirty: false, keepError: false, keepTouched: false})
            if (code === 400) {
                setFormError(info.detail)
            } else {
                setFormError(`Необработанная ошибка ${code}`)
            }
        }
    })
    const FioOptions = {required: 'Поле обязательно', maxLength: {value: 50, message: 'Максимум 50 символов'}}

    return (
        <BaseForm title="Регистрация преподавателя" formError={formError} onSubmit={handleSubmit(onSubmit)}>
            <UsernameInput register={register} errors={errors.username}/>
            <PasswordInput register={register} errors={errors.password}/>
            <PasswordInput register={register} errors={errors.rePassword} re={true} getValues={getValues}/>
            <TextInput register={register} name="lastName" opts={FioOptions} errors={errors.lastName} label={"Фамилия"}/>
            <TextInput register={register} name="firstName" opts={FioOptions} errors={errors.firstName} label={"Имя"}/>
            <TextInput register={register} name="fathersName" opts={FioOptions} errors={errors.fathersName} label={"Отчество"}/>
            <SubmitButton>Создать</SubmitButton>
        </BaseForm>
    );
};

export default TeacherCreateForm;