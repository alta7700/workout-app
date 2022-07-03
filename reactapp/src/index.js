import React, {createContext} from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import AuthStore from "./store/auth";
import LoaderStore from "./store/loader";


const auth = new AuthStore()
const loading = new LoaderStore()


export const Context = createContext({
    auth,
    loading
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{ auth, loading }}>
        <App/>
    </Context.Provider>
);
