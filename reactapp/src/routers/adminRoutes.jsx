import React from 'react';
import {Route, Routes} from "react-router-dom";
import TeachersPage from "../pages/admin/TeachersPage";
import SubjectsPage from "../pages/admin/SubjectsPage";
import AdminLayout from "../layouts/AdminLayout";
import StudentsPage from "../pages/admin/StudentsPage";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout/>}>
                <Route path="/teachers" element={<TeachersPage/>}/>
                <Route path="/subjects" element={<SubjectsPage/>}/>
                <Route path="/students" element={<StudentsPage/>}/>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;