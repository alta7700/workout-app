import React from 'react';
import classes from "./Fields.module.css";

const SubmitButton = ({type, children, ...props}) => {
    return (
        <button type={type || 'submit'} className={classes.submit} {...props}>{children}</button>
    );
};

export default SubmitButton;