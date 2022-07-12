import api from "./config";

export default class UsersService {

    static studentsUrl = "/auth/users/students"
    static teachersUrl = "/auth/users/teachers"

    static async getTeachers(q) {
        try {
            const response = await api.get(`${this.teachersUrl}/`, {params: q})
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [499, 'Ошибка сети']
        }
    }

    static async getStudents(q) {
        try {
            const response = await api.get(`${this.studentsUrl}/`, {params: q})
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

    static async getAvailableFaculties() {
        try {
            const response = await api.get(`${this.studentsUrl}/tree`)
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [499, 'Ошибка сети']
        }
    }

    static async getFacultyCourses(facultyId) {
        try {
            const response = await api.get(`${this.studentsUrl}/tree/${facultyId}`)
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [499, 'Ошибка сети']
        }
    }

    static async getCourseGroups(facultyId, courseN) {
        try {
            const response = await api.get(`${this.studentsUrl}/tree/${facultyId}/${courseN}`)
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [499, 'Ошибка сети']
        }
    }

    static async getGroupStudents(facultyId, courseN, groupN) {
        try {
            const response = await api.get(`${this.studentsUrl}/tree/${facultyId}/${courseN}/${groupN}`)
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [499, 'Ошибка сети']
        }
    }

}