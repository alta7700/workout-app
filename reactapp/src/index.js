import React, {createContext} from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import AuthStore from "./store/auth";
import LoaderStore from "./store/loader";
import {BrowserRouter} from "react-router-dom";
import FacultiesStore from "./store/faculties";
import SubjectsStore from "./store/subjects";
import TeachersStore from "./store/teachers";


const auth = new AuthStore()
const loading = new LoaderStore()
const faculties = new FacultiesStore()
const subjects = new SubjectsStore()
const teachers = new TeachersStore()
const students = new SubjectsStore()


export const Context = createContext({
    auth,
    loading,
    faculties,
    subjects,
    teachers,
    students
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{ auth, loading, faculties, subjects, teachers, students}}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Context.Provider>
);
