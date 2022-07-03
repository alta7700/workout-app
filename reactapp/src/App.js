import React, {useContext, useEffect} from 'react';
import {Context} from "./index";
import LoginForm from "./components/forms/LoginForm";
import classes from "./App.module.css";
import {observer} from "mobx-react-lite";
import useFetching from "./hooks/useFetching";


const App = observer(() => {

    const {auth, loading} = useContext(Context)
    const checkAuth = useFetching(auth.checkAuth)

    useEffect(() => {
        (async () => await checkAuth())()
    }, [])

    return (
        <div className={classes.app}>
            {loading.state && <h1>Загрузка</h1>}
            {!auth.isAuth ? <LoginForm/> : Object.entries(auth.user).map(([key, value]) =>
                <p key={key}>{key}: {value}</p>
            )}
        </div>
    );
});

export default App;