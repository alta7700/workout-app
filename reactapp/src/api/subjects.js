import api from "./config";

export default class SubjectsService {

    static subjectsUrl = '/subjects'

    static async get() {
        try {
            const response = await api.get(this.subjectsUrl)
            return [response.status, response.data]
        } catch (e) {

        }
    }

    static async create(title, shortTitle) {
        try {
            const response = await api.post(`${this.subjectsUrl}/create/`, {title, shortTitle})
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [null, null]
        }
    }

}