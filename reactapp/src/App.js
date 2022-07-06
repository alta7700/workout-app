import React, {useContext, useEffect, useState} from 'react';
import {Context} from "./index";
import "./normalize.css"
import "./App.css";
import {observer} from "mobx-react-lite";
import useFetching from "./hooks/useFetching";
import Loader from "./components/Loader";
import Router from "./routers/Router";
import LoginPage from "./pages/LoginPage";


const App = observer(() => {

    const {auth, loading} = useContext(Context)
    const checkAuth = useFetching(async () => {
        await auth.checkAuth()
        setAuthChecked(true)
    })
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <>
            {loading.state && <Loader/>}
            {authChecked && (!auth.isAuth ? <LoginPage/> : <Router user={auth.user}/>)}
        </>
    );
});

export default App;