import React from 'react';
import {useForm} from "react-hook-form";
import classes from "./LoginForm.module.css";
import TextInput from "./TextInput";

const LoginForm = () => {

    const {register, formState: { errors, dirtyFields }, handleSubmit} = useForm({
        mode: 'onChange',
        criteriaMode: "all"
    })

    return (
        <div className={classes.container}>
            <span className={classes.title}>Авторизация</span>
            <form className={classes.form_container} onSubmit={handleSubmit((data) => console.log(data))}>
                <TextInput
                    register={register("username", {
                        required: 'Обязательное поле',
                        minLength: {value: 5, message: 'Минимальная длина - 5 символов'},
                    })}
                    errors={errors.username}
                    dirty={dirtyFields.username}
                    label="Логин"
                />
                <TextInput
                    register={register("password",  {
                        required: 'Обязательное поле',
                        minLength: {value: 8, message: 'Минимальная длина - 8 символов'},
                        validate: {
                            digit: v => /(?=.*[0-9])/.test(v) || "Минимум одна цифра",
                            lower: v => /(?=.*[a-z])/.test(v) || "Нужна одна прописная буква",
                            upper: v => /(?=.*[A-Z])/.test(v) || "Нужна одна строчная буква",
                            allowed: v => /^[0-9a-zA-Z!@#$%^&*]{8,}$/.test(v) ||
                                "Разрешены только латинские буквы, цифры и символы !@#$%^&*",
                        }
                    })}
                    errors={errors.password}
                    dirty={dirtyFields.password}
                    label="Пароль"
                />
                <input type='submit' value='Войти'/>
            </form>
        </div>
    );
};

export default LoginForm;