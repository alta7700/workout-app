import React from 'react';
import classes from "../ItemTables.module.css";

const TableFilters = ({availableFilters, fields, filters, processSetFilters}) => {

    function getFilterValues(fieldName, values) {
        const field = fields[fieldName]
        const getValue = field.computed
                            ? (value) => field.computed(value)
                            : field.bool
                                ? (value) => value ? "Да" : "Нет"
                                : (value) => value
        let list = []
        for (let v of values) {
            list.push([v, getValue(v)])
        }
        return list
    }


    return (
        <div className={classes.filtersContainer}><h2>Фильтр</h2>
            {Object.entries(availableFilters).map(([field, values]) =>
                <ul key={field} className={classes.filter}><h3>{fields[field].title}</h3>
                    {getFilterValues(field, values).map(value =>
                        <li
                            key={value[0]}
                            className={filters[field]?.includes(value[0]) ? classes.filterSelected: null}
                            onClick={() => processSetFilters(field, value[0])}
                        >
                            {value[1]}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default TableFilters;