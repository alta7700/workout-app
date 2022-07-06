import api, {urlWithQ} from "./config";

export default class UsersService {

    static studentsUrl = "/auth/users/students"
    static teachersUrl = "/auth/users/teachers"

    static async getTeachers(q) {
        try {
            const response = await api.get(urlWithQ(this.teachersUrl, q))
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [499, 'Ошибка сети']
        }
    }

    static async getSubjectTeachers(subject_id) {
        try {
            const response = await api.get(`/subjects/${subject_id}/teachers/`)
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [499, 'Ошибка сети']
        }
    }

}