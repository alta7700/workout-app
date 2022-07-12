import React from 'react';
import classes from "../ItemTables.module.css";

const TableHeader = ({fields, sort, processSetSort, selected, processSetSelected, itemsCount}) => {
    return (
        <thead>
            <tr>
                {selected !== undefined && <th
                    className={classes.checkbox}
                    onClick={() => processSetSelected(true)}
                >
                    <input type="checkbox" checked={selected.length === itemsCount} readOnly={true}/>
                </th>}
                {sort !== undefined
                    ? Object.entries(fields).map(([name, field]) =>
                        <th
                            key={name}
                            className={sort[name] && classes.selectedSort}
                            onClick={() => processSetSort(name)}
                        >
                            {field.title}
                            {sort[name] &&
                                <div className={classes.arrowContainer}>
                                    <p>{Object.keys(sort).findIndex((value) => value === name) + 1}</p>
                                    <div className={sort[name] === "desc" ? classes.arrowBot : classes.arrowTop}/>
                                </div>
                            }
                        </th>
                    )
                    : Object.entries(fields).map(([name, field]) =>
                        <th key={name}>{field.title}</th>
                    )
                }
            </tr>
        </thead>
    );
};

export default TableHeader;