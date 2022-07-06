import React from 'react';
import classes from "./BaseForm.module.css";

const BaseForm = ({title, formError, onSubmit, children}) => {
    return (
        <div className={classes.container}>
            <span className={classes.title}>{title}</span>
            {formError && <span className={classes.error}>{formError}</span>}
            <form className={classes.formContainer} onSubmit={onSubmit}>
                {children}
            </form>
        </div>
    );
};

export default BaseForm;