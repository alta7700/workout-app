import React, {useState} from 'react';
import classes from "./ItemList.module.css";
import ItemRow from "./ItemRow";

const ItemList = ({itemList, fields, initSort, filters}) => {

    const [sort, setSort] = useState(initSort || {})
    const [selectedFilters, setSelectedFilters] = useState({})
    const [selected, setSelected] = useState([])

    const processSetSort = (field) => {
        let newSort = {...sort}
        const fieldSort = newSort[field]
        if (fieldSort) {
            if (fieldSort === "asc") {
                newSort[field] = "desc"
            } else {
                delete newSort[field]
            }
        } else {
            newSort[field] = "asc"
        }
        setSort(newSort)
    }
    const processSetSelected = (all, id) => {
        if (all) {
            let itemIds = []
            if (selected.length !== itemList.length) {
                itemList.map(item => itemIds.push(item.id))
            }
            setSelected(itemIds)
        } else {
            let itemIds = [...selected]
            let index = itemIds.findIndex(value => value === id)
            index === -1 ? itemIds.push(id) : itemIds.splice(index, 1)
            setSelected(itemIds)
        }
    }
    const processSetSelectedFilters = (field, value) => {
        let newSelectedFilters = {...selectedFilters}
        let values = newSelectedFilters[field]
        values
            ? values.includes(value)
                ? values.length > 1
                    ? newSelectedFilters[field] = values.filter(v => v !== value)
                    : delete newSelectedFilters[field]
                : newSelectedFilters[field].push(value)
            : newSelectedFilters[field] = [value]
        setSelectedFilters(newSelectedFilters)
    }

    function validateValue(value) {
        value.toLowerCase && (value = value.toLowerCase())
        return value
    }

    function sorter(a, b) {
        let num
        for (let [field, direction] of Object.entries(sort)) {
            let aValue = validateValue(a[field])
            let bValue = validateValue(b[field])
            if (direction === "desc") {
                num = (aValue < bValue) - (bValue < aValue)
            } else {
                num = (bValue < aValue) - (aValue < bValue)
            }
            if (num !== 0) {
                return num
            }
        }
        return 0
    }

    function filtration(row) {
        for (let [field, values] of Object.entries(selectedFilters)) {
            if (!values.includes(row[field])) {
                return false
            }
        }
        return true
    }

    function sortedItemList() {
        return [...itemList].filter(filtration).sort(sorter)
    }

    function filterValues(fieldName) {
        const field = fields[fieldName]
        const getPair = field.computed ? (value) => [value, field.computed(value)]
                        : field.bool ? (value) => [value, value ? "Да" : "Нет"]
                            : (value) => [value, value]
        const values = []  // [[0 - значение для фильтрации, 1 - значение дял вывода], []] могут быть разными если computed

        for (let item of itemList) {
            let fieldValue = getPair(item[fieldName])
            !values.some((v) => v[0] === fieldValue[0]) && values.push(fieldValue)
        }
        values.sort((a, b) => (b[1] < a[1]) - (a[1] < b[1]))
        return values
    }

    return (
        <div className={classes.itemListContainer}>
            <table className={classes.table}>
                <thead>
                    <tr>
                        <th
                            className={classes.checkbox}
                            onClick={() => processSetSelected(true)}
                        >
                            <input type="checkbox" checked={selected.length === itemList.length} readOnly={true}/>
                        </th>
                        {Object.entries(fields).map(([name, field]) =>
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
                        )}
                    </tr>
                </thead>
                <tbody>
                    {sortedItemList().map(instance =>
                        <tr key={instance.id}>
                            <td onClick={() => processSetSelected(false, instance.id)}>
                                <input type="checkbox" checked={selected.includes(instance.id)} readOnly={true}/>
                            </td>
                            <ItemRow instance={instance} fields={fields}/>
                        </tr>
                    )}
                </tbody>
            </table>
            {filters && <div className={classes.filtersContainer}><h2>Фильтр</h2>
                {filters.map(field =>
                    <ul key={field} className={classes.filter}><h3>{fields[field].title}</h3>
                        {filterValues(field).map(value =>
                            <li
                                key={value[0]}
                                className={selectedFilters[field] && selectedFilters[field].includes(value[0]) && classes.selected}
                                onClick={() => processSetSelectedFilters(field, value[0])}
                            >
                                {value[1]}
                            </li>
                        )}
                    </ul>
                )}
            </div>}
        </div>
    );
};

export default ItemList;