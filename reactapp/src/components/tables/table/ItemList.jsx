import React from 'react';
import classes from "../ItemTables.module.css";
import ItemRow from "../ItemRow";
import ActionBar from "../../actions/ActionBar";
import TableFilters from "./TableFilters";
import TableHeader from "./TableHeader";
import Paginator from "./Paginator";

const ItemList = ({
                      itemList, keyName, fields, availableFilters, actions,
                      states: {
                          search, setSearch, sort, setSort, filters, setFilters, selected, setSelected,
                          activePage, setActivePage, pagesCount, setPagesCount
    }}) => {

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
    const processSetSelected = (all, pk) => {
        if (all) {
            let itemPKs = []
            if (selected.length !== itemList.length) {
                itemList.map(item => itemPKs.push(item[keyName]))
            }
            setSelected(itemPKs)
        } else {
            let itemPKs = [...selected]
            let index = itemPKs.findIndex(value => value === pk)
            index === -1 ? itemPKs.push(pk) : itemPKs.splice(index, 1)
            setSelected(itemPKs)
        }
    }
    const processSetFilters = (field, value) => {
        let newFilters = {...filters}
        let values = newFilters[field]
        values
            ? values.includes(value)
                ? values.length > 1
                    ? newFilters[field] = values.filter(v => v !== value)
                    : delete newFilters[field]
                : newFilters[field].push(value)
            : newFilters[field] = [value]
        setFilters(newFilters)
    }

    return (
        <>
            <ActionBar search={search} setSearch={setSearch} actions={actions}/>
            {activePage && <Paginator {...{activePage, setActivePage, pagesCount}}/>}
            <div className={classes.itemListContainer}>
                <table className={classes.table}>
                    <TableHeader {...{fields, sort, processSetSort, selected, processSetSelected, itemsCount: itemList.length}}/>
                    <tbody>
                        {itemList.map(instance =>
                            <tr key={instance[keyName]}>
                                {selected !== undefined && <td onClick={() => processSetSelected(false, instance[keyName])}>
                                    <input type="checkbox" checked={selected.includes(instance[keyName])}
                                           readOnly={true}/>
                                </td>}
                                <ItemRow instance={instance} fields={fields}/>
                            </tr>
                        )}
                    </tbody>
                </table>
                {availableFilters && <TableFilters {...{availableFilters, fields, filters, processSetFilters}}/>}
            </div>
            {activePage && <Paginator {...{activePage, setActivePage, pagesCount}}/>}
        </>
    );
};

export default ItemList;