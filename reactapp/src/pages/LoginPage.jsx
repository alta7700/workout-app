import React from 'react';
import LoginForm from "../components/forms/LoginForm";

const LoginPage = () => {
    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "100vh"}}>
            <LoginForm/>
        </div>
    );
};

export default LoginPage;