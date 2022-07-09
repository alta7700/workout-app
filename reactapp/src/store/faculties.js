import {getFaculties} from "../api/faculties";
import {makeAutoObservable} from "mobx";

export default class FacultiesStore {

    constructor() {
        makeAutoObservable(this)
    }

    list = []
    fetched = false

    async check() {
        if (!this.fetched) {
            this.fetched = await this.load()
        }
    }

    async load() {
        let [status, list] = await getFaculties()
        if (status === 200) {
            this.list = list
            return true
        }
        alert('Не удалось загрузить факультеты')
        return false
    }

    get(id) {
        if (id) {
            return this.list.filter(value => value.id === id)[0]
        } else {
            return this.list
        }
    }

    toSelector() {
        const opts = []
        this.list.map(faculty =>
            opts.push({value: faculty.id, title: faculty.title})
        )
        return opts
    }

}