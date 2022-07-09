import React from 'react';
import classes from "./Fields.module.css";
import ErrorsDialog from "./ErrorsDialog";

const NumberInput = ({ register, name, opts, errors, label, children, ...props }) => {

    return (
        <div className={classes.container}>
            <input
                type="number"
                {...register(name, opts)}
                {...props}
                className={classes.input}
                placeholder={' '}
            />
            <label className={classes.label}>{label}</label>
            <ErrorsDialog errors={errors}/>
            {children} {/* например для глазика */}
        </div>
    );
};

export default NumberInput;