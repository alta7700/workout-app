import React from 'react';
import classes from "./Fields.module.css";

const Selector = ({register, name, options, label, ...props}) => {

    return (
        <div className={classes.container}>
            <select {...register(name)} {...props} className={classes.input}>
                {options.map(value =>
                    <option key={value.value} value={value.value}>
                        {value.title}
                    </option>
                )}
            </select>
            <label className={classes.label}>{label}</label>
        </div>
    );
};

export default Selector;