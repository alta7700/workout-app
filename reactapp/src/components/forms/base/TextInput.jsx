import React, {useState} from 'react';
import classes from "./Fields.module.css";
import errorSvg from "./svg/error.svg"
import successSvg from "./svg/success.svg"

const TextInput = ({ register, errors, label, children, ...props}) => {

    const [showErrors, setShowErrors] = useState(false)

    return (
        <div className={classes.container}>
            <input
                {...register}
                {...props}
                className={classes.input}
                placeholder={' '}
            />
            <label className={classes.label}>{label}</label>
            <div className={classes.errors} onClick={() => setShowErrors(prevState => !prevState)}>
                {showErrors && errors && <div className={classes.dialog}>
                    {Object.entries(errors.types).map(([type, message]) =>
                        <p key={type}>*{message}</p>
                    )}
                </div>}
                {errors ? <img src={errorSvg} alt="Ошибка"/> : <img src={successSvg} alt="Правильно"/>}
            </div>
            {children} {/* например для глазика */}
        </div>
    );
};

export default TextInput;