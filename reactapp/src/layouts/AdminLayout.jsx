import React from 'react';
import {Link, Outlet, useLocation} from "react-router-dom"
import classes from "./Layout.module.css";
import classNames from "classnames";

const AdminLayout = () => {

    const location = useLocation()
    const links = [
        {name: 'Преподаватели', path: '/teachers'},
        {name: 'Предметы', path: '/subjects'},
        {name: 'Студенты', path: '/students'},
    ]

    return (
        <>
            <nav className={classes.nav}>
                {links.map(link =>
                    <Link
                        to={link.path}
                        key={link.path}
                        className={location.pathname.startsWith(link.path) ?
                            classNames(classes.navLink, classes.active) : classes.navLink}
                    >{link.name}</Link>
                )}
            </nav>
            <div className={classes.content}>
                <Outlet/>
            </div>
        </>
    );
};

export default AdminLayout;