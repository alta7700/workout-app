import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import {useForm} from "react-hook-form";
import useFetching from "../../hooks/useFetching";
import BaseForm from "./base/BaseForm";
import UsernameInput from "./base/UsernameInput";
import PasswordInput from "./base/PasswordInput";
import TextInput from "./base/TextInput";
import NumberInput from "./base/NumberInput";
import SubmitButton from "./base/SubmitButton";
import Selector from "./base/Selector";
import useEffectFetching from "../../hooks/useEffectFetching";

const StudentCreateForm = () => {
    const {auth, students} = useContext(Context)
    const {register, resetField, getValues, formState: { errors }, handleSubmit} = useForm({
        mode: 'onChange',
        criteriaMode: "all",
    })
    const [formError, setFormError] = useState('')
    const onSubmit = useFetching(async (data) => {
        const [code, info] = await auth.registerStudent(
            data.username, data.password, data.rePassword, data.firstName, data.lastName, data.fathersName,
            data.facultyId, data.courseN, data.groupN
        );
        if (code === 201) {
            await students.update()
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
    const { faculties } = useContext(Context)

    useEffectFetching(async () => {
        await faculties.check()
    }, [])
    const facultiesOptions = faculties.toSelector()

    const FioOptions = {required: 'Поле обязательно', maxLength: {value: 50, message: 'Максимум 50 символов'}}
    const courseOpts = {valueAsNumber: true, min: 1, max: 6}

    return (
        <BaseForm title="Регистрация студента" formError={formError} onSubmit={handleSubmit(onSubmit)}>
            <UsernameInput register={register} errors={errors.username}/>
            <PasswordInput register={register} errors={errors.password}/>
            <PasswordInput register={register} errors={errors.rePassword} re={true} getValues={getValues}/>
            <TextInput register={register} name="lastName" opts={FioOptions} errors={errors.lastName} label={"Фамилия"}/>
            <TextInput register={register} name="firstName" opts={FioOptions} errors={errors.firstName} label={"Имя"}/>
            <TextInput register={register} name="fathersName" opts={FioOptions} errors={errors.fathersName} label={"Отчество"}/>
            <Selector register={register} name="facultyId" label="Факультет" options={facultiesOptions}/>
            <NumberInput register={register} name="courseN" opts={courseOpts} errors={errors.courseN} label="Курс"/>
            <NumberInput register={register} name="groupN" opts={courseOpts} errors={errors.groupN} label="Группа"/>
            <SubmitButton>Создать</SubmitButton>
        </BaseForm>
    );
};

export default StudentCreateForm;