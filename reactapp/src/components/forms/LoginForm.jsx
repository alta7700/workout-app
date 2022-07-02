import React from 'react';
import {useForm} from "react-hook-form";
import classes from "./LoginForm.module.css";

const LoginForm = () => {

    const {register} = useForm()

    return (
        <div>
            <span>Авторизация</span>
            <form className={classes.container}>
                <input
                    {...register("username")}
                    className={classes.textField}
                    placeholder="Логин"
                />
                <input
                    {...register("password")}
                    placeholder="Пароль"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default LoginForm;