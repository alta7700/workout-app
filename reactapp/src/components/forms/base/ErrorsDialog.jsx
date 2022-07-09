import React, {useState} from 'react';
import classes from "./Fields.module.css";
import errorSvg from "./svg/error.svg";
import successSvg from "./svg/success.svg";

const ErrorsDialog = ({errors}) => {
    const [showErrors, setShowErrors] = useState(false)

    return (
        <div className={classes.errors} onClick={() => setShowErrors(prevState => !prevState)}>
            {showErrors && errors && <div className={classes.dialog}>
                {Object.entries(errors.types).map(([type, message]) =>
                    <p key={type}>*{message}</p>
                )}
            </div>}
            {errors ? <img src={errorSvg} alt="Ошибка"/> : <img src={successSvg} alt="Правильно"/>}
        </div>

    );
};

export default ErrorsDialog;