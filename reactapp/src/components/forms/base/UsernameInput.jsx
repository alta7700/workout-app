import React from 'react';
import TextInput from "./TextInput";

const UsernameInput = ({register, errors, ...props}) => {
    return (
        <TextInput
            register={register("username",  {
                required: 'Обязательное поле',
                minLength: {value: 5, message: 'Минимум 5 символов'},
                maxLength: {value: 25, message: 'Максимум 25 символов'},
                validate: {
                    allowed: v => /^[0-9a-zA-Z-_]{0,}$/.test(v) || "Только латинские буквы, цифры и символы -_",
                },
            })}
            errors={errors}
            label="Логин"
            type="text"
            autoComplete={"username"}
            {...props}
        />
    );
};

export default UsernameInput;
