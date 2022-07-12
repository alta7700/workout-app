import React from 'react';
import {Route, Routes} from "react-router-dom";
import TeachersPage from "../pages/admin/TeachersPage";
import SubjectsPage from "../pages/admin/SubjectsPage";
import AdminLayout from "../layouts/AdminLayout";
import StudentsPage from "../pages/admin/StudentsPage";
import StudentsTree from "../pages/admin/StudentsTree";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout/>}>
                <Route path="/teachers" element={<TeachersPage/>}/>
                <Route path="/subjects" element={<SubjectsPage/>}/>
                <Route path="/students" element={<StudentsPage/>}/>
                <Route path="/students/tree" element={<StudentsTree/>}/>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;