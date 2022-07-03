import React, {useState} from 'react';
import TextInput from "./TextInput";
import classes from "./PasswordInput.module.css";
import classNames from "classnames";

const PasswordInput = ({register, errors, name, label, current}) => {

    const [visible, setVisible] = useState(false)

    return (
        <TextInput
            register={register(name,  {
                required: 'Обязательное поле',
                minLength: {value: 8, message: 'Минимум 8 символов'},
                maxLength: {value: 25, message: 'Максимум 25 символов'},
                validate: current ? {} : {
                    digit: v => /(?=.*[0-9])/.test(v) || "Минимум одна цифра",
                    lower: v => /(?=.*[a-z])/.test(v) || "Нужна одна прописная буква",
                    upper: v => /(?=.*[A-Z])/.test(v) || "Нужна одна строчная буква",
                    allowed: v => /^[0-9a-zA-Z!@#$%^&*]{0,}$/.test(v) ||
                        "Только латинские буквы, цифры и символы !@#$%^&*",
                }
            })}
            errors={errors}
            label={label || "Пароль"}
            type={visible ? "text" : "password"}
            autoComplete={current ? "current-password" : "new-password"}
        >
            <div className={classes.eye} onClick={() => setVisible(prevState => !prevState)}>
                <div className={visible ? classes.line : classNames(classes.line, classes.painted)}/>
            </div>
        </TextInput>


    );
};

export default PasswordInput;