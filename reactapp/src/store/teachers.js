import {makeAutoObservable} from "mobx";
import UsersService from "../api/users";

export default class TeachersStore {

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

    async update() {
        const [status, list] = await UsersService.getTeachers()
        if (status === 200) {
            this.list = list
            return true
        }
        alert("Преподаватели не загрузились")
        return false
    }

    subjectTeachers(subjId) {
        return this.list.map(v => subjId in v.subjects)
    }

}