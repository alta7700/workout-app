import React, {useContext} from 'react';
import {Context} from "./index";
import LoginForm from "./components/forms/LoginForm";
import classes from "./App.module.css";


const App = () => {

    const {auth} = useContext(Context)

    return (
        <div className={classes.app}>
            {auth.isAuth ? <p></p> : <LoginForm/>}
        </div>
    );
};

export default App;