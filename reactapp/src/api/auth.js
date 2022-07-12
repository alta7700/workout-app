import api from "./config";

export default class AuthService {

    static authUrl = "/auth/jwt"
    static studentsUrl = "/auth/users/students"
    static teachersUrl = "/auth/users/teachers"

    static async login(username, password) {
        return await api.post(`${this.authUrl}/create`, {username, password})
    }

    static async refresh(refreshToken) {
        return await api.post(`${this.authUrl}/refresh`, refreshToken)
    }

    static async registerStudent(username, password, rePassword, firstName, lastName, fathersName,
                                 facultyId, courseN, groupN) {
        return await api.post(`${this.studentsUrl}/create`, {
            username, password, rePassword, firstName, lastName, fathersName, facultyId, courseN, groupN
        })
    }

    static async registerTeacher(username, password, rePassword, firstName, lastName, fathersName) {
        return await api.post(`${this.teachersUrl}/create`, {
            username, password, rePassword, firstName, lastName, fathersName
        })
    }
}