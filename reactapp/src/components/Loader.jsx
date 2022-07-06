import React from 'react';
import classes from "./Loader.module.css"

const Loader = () => {
    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <div className={classes.circles}>
                    <div className={classes.circle}></div>
                    <div className={classes.circle}></div>
                    <div className={classes.circle}></div>
                    <div className={classes.shadow}></div>
                    <div className={classes.shadow}></div>
                    <div className={classes.shadow}></div>
                </div>
                <p>З а г р у з к а</p>
            </div>
        </div>
    );
};

export default Loader;