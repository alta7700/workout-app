import React from 'react';
import AdminRoutes from "./adminRoutes";

const Router = ({user}) => {

    return (
        <>
            {user.isSuperuser ? <AdminRoutes/> : null}
        </>
    );
};

export default Router;