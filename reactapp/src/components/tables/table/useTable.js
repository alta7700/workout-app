import {useState} from "react";
import ItemList from "./ItemList";

const useTable = ({itemList, fields, availableFilters, actions,
                      noUseSearch, noUseSort, noUseSelects, noUsePagination
}) => {

    const [search, setSearch] = useState("")
    const [sort, setSort] = useState({})
    const [filters, setFilters] = useState({})
    const [selected, setSelected] = useState([])
    const [activePage, setActivePage] = useState({page:1, firstTime: true})
    const [pagesCount, setPagesCount] = useState(1)

    const keyName = fields.id ? "id" : (() => {
        for (let [name, f] of Object.entries(fields)) {
            if (f.pk === true) {
                return name
            }
        }
        throw new Error("field \"id\" (lowerCase) or field with \"pk=true\" in \"fields\" parameter of \"useTable\" is required")
    })()

    let states = {}
    if (!noUseSearch) {
        states["search"] = search
        states["setSearch"] = setSearch
    }
    if (!noUseSort) {
        states["sort"] = sort
        states["setSort"] = setSort
    }
    if (availableFilters) {
        states["filters"] = filters
        states["setFilters"] = setFilters
    }
    if (!noUseSelects) {
        states["selected"] = selected
        states["setSelected"] = setSelected
    }
    if (!noUsePagination) {
        states["activePage"] = activePage
        states["setActivePage"] = setActivePage
        states["pagesCount"] = pagesCount
        states["setPagesCount"] = setPagesCount
    }

    return {
        ...states,
        Table:
            <ItemList
                itemList={itemList}
                keyName={keyName}
                fields={fields}
                availableFilters={availableFilters}
                actions={actions}
                states={states}
            />
    }

}

export default useTable;