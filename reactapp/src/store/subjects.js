import SubjectsService from "../api/subjects";
import {makeAutoObservable} from "mobx";

export default class SubjectsStore {

    constructor() {
        makeAutoObservable(this)
    }

    list = []
    fetched = false

    async check() {
        if (!this.fetched) {
            this.fetched = await this.update()
        }
    }

    getOne(id) {
        let s = this.list.filter(value => value.id === id)
        if (s.length === 1) {
            return s[0]
        }
        return null
    }

    async update() {
        let [status, list] = await SubjectsService.get()
        if (status === 200) {
            this.list = list
            return true
        }
        alert('Не удалось загрузить предметы')
        return false
    }

}