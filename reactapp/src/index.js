import React, {createContext} from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import AuthStore from "./store/auth";


const auth = new AuthStore()

export const Context = createContext({
    auth
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        auth
    }}>
        <App/>
    </Context.Provider>
);
