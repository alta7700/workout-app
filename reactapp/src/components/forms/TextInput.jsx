import React from 'react';
import classes from "./TextInput.module.css";

const TextInput = ({ register, errors, dirty, label, ...props}) => {

    return (
        <div className={classes.field}>
            <input
                {...register}
                {...props}
                className={classes.input}
                placeholder={label}
            />
            {errors && Object.entries(errors.types).map(([type, message]) =>
                <p key={type}>{message}</p>
            )}
        </div>
    );
};

export default TextInput;