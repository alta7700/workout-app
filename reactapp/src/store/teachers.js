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

    search(value) {
        let filtered = [...this.list]
        if (value) {
            value.toLowerCase().split(" ").map(frag =>
                filtered = filtered.filter(t =>
                    t.lastName.toLowerCase().startsWith(frag) ||
                    t.firstName.toLowerCase().startsWith(frag) ||
                    t.fathersName.toLowerCase().startsWith(frag) ||
                    t.username.toLowerCase().includes(frag)
                )
            )
        }
        return filtered
    }

    subjectTeachers(subjId) {
        return this.list.map(v => subjId in v.subjects)
    }

}