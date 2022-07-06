import {getFaculties} from "../api/faculties";
import {makeAutoObservable} from "mobx";

export default class FacultiesStore {

    constructor() {
        makeAutoObservable(this)
    }

    faculties = []
    fetched = false

    async get(id) {
        if (!this.fetched) {
            this.fetched = await this.load()
        }
        if (id) {
            return this.faculties.filter(value => value.id === id)[0]
        } else {
            return this.faculties
        }
    }

    async load() {
        let [status, list] = await getFaculties()
        if (status === 200) {
            this.faculties = list
            return true
        }
        alert('Не удалось загрузить факультеты')
        return false
    }
}