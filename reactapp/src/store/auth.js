import {makeAutoObservable} from "mobx";
import AuthService from "../api/auth";

export default class AuthStore {

    user = null
    isAuth = false

    constructor() {
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this.isAuth = bool
    }

    setUser(data) {
        this.user = data
    }

    async login(username, password) {
        try {
            const response = await AuthService.login(username, password)
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            this.setIsAuth(true)
            this.setUser(response.data.user)
            return [response.code, {}]
        } catch (e) {
            const response = e.response
            if (response) {
                return [response.code, response.data]
            } else {
                return [499, 'Проблема с сетью']
            }
        }
    }

    async registerStudent(username, password, rePassword, firstName, lastName, fathersName,
                                 facultyId, courseN, groupN) {
        try {
            const response = await AuthService.registerStudent(username, password, rePassword,
                firstName, lastName, fathersName, facultyId, courseN, groupN)
            return [response.code, {}]
        } catch (e) {
            const response = e.response
            if (response) {
                return [response.code, response.data]
            } else {
                return [499, 'Проблема с сетью']
            }
        }
    }

    async registerTeacher(username, password, rePassword, firstName, lastName, fathersName,
                                 ) {
        try {
            const response = await AuthService.registerTeacher(username, password, rePassword,
                firstName, lastName, fathersName)
            return [response.code, {}]
        } catch (e) {
            const response = e.response
            if (response) {
                return [response.code, response.data]
            } else {
                return [499, 'Проблема с сетью']
            }
        }
    }

    logout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        this.setIsAuth(false)
        this.setUser(null)
    }
}