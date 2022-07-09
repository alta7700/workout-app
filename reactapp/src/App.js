import React, {useContext, useEffect, useState} from 'react';
import {Context} from "./index";
import "./normalize.css"
import "./App.css";
import {observer} from "mobx-react-lite";
import useFetching from "./hooks/useFetching";
import Loader from "./components/Loader";
import Router from "./routers/Router";
import LoginPage from "./pages/LoginPage";
import useEffectFetching from "./hooks/useEffectFetching";


const App = observer(() => {

    const {auth, loading} = useContext(Context)

    const [authChecked, setAuthChecked] = useState(false)

    useEffectFetching(async () => {
        await auth.checkAuth()
        setAuthChecked(true)
    }, [])

    return (
        <>
            {loading.state && <Loader/>}
            {authChecked && (!auth.isAuth ? <LoginPage/> : <Router user={auth.user}/>)}
        </>
    );
});

export default App;