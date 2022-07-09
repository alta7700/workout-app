import React, {useState} from 'react';
import classes from "./ActionsBar.module.css";
import ModalWindow from "./ModalWindow";

const ActionBar = ({search, actions}) => {

    const [action, setAction] = useState("")

    return (
        <div className={classes.actionBar}>
            <input
                className={classes.search}
                type="search"
                value={search.value} onChange={(e) => search.set(e.target.value)}
                placeholder="Поиск..."
            />
            <select value={action} onChange={(e) => setAction(e.target.value)}>
                <option value={""}>Выберите действие</option>
                {Object.entries(actions).map(([value, action]) =>
                    <option key={value} value={value}>{action.name}</option>
                )}
            </select>
            {action && <ModalWindow closeModal={() => setAction("")}>{actions[action].component}</ModalWindow>}
        </div>
    );
};

export default ActionBar;