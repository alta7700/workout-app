import React, {useContext} from 'react';
import {useForm} from "react-hook-form";
import classes from "./LoginForm.module.css";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import {Context} from "../../index";

const LoginForm = () => {

    const {auth} = useContext(Context)
    const {register, formState: { errors }, handleSubmit} = useForm({
        mode: 'onChange',
        criteriaMode: "all",
    })

    const onSubmit = async (data) => {
        await auth.login(data.username, data.password)
    }
    return (
        <div className={classes.container}>
            <span className={classes.title}>Авторизация</span>
            <form className={classes.form_container} onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    register={register("username", {
                        required: 'Обязательное поле',
                        minLength: {value: 5, message: 'Минимальная длина - 5 символов'},
                    })}
                    errors={errors.username}
                    label="Логин"
                    autoComplete={"username"}
                />
                <PasswordInput
                    register={register}
                    errors={errors.password}
                    name={"password"}
                    current={true}
                />
                <button type='submit' className={classes.submit}>Войти</button>
            </form>
        </div>
    );
};

export default LoginForm;