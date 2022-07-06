import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import PasswordInput from "./base/PasswordInput";
import {Context} from "../../index";
import useFetching from "../../hooks/useFetching";
import UsernameInput from "./base/UsernameInput";
import BaseForm from "./base/BaseForm";
import SubmitButton from "./base/SubmitButton";

const LoginForm = () => {

    const {auth} = useContext(Context)
    const {register, resetField, formState: { errors }, handleSubmit} = useForm({
        mode: 'onChange',
        criteriaMode: "all",
    })
    const [formError, setFormError] = useState('')
    const onSubmit = useFetching(async (data) => {
        const [code, info] = await auth.login(data.username, data.password);
        if (code !== 200) {
            resetField("password", {keepDirty: false, keepError: false, keepTouched: false})
            setFormError(info.detail)
        }
    })

    return (
        <BaseForm title="Авторизация" formError={formError} onSubmit={handleSubmit(onSubmit)}>
            <UsernameInput register={register} errors={errors.username}/>
            <PasswordInput register={register} errors={errors.password} current={true}/>
            <SubmitButton>Войти</SubmitButton>
        </BaseForm>
    );
};

export default LoginForm;