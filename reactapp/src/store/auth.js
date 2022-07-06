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
            return [response.status, {}]
        } catch (e) {
            const response = e.response
            if (response) {
                return [response.status, response.data]
            } else {
                return [499, 'Проблема с сетью']
            }
        }
    }

    async refresh() {
        let refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
            try {
                const response = await AuthService.refresh(refreshToken)
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)
                this.setIsAuth(true)
                this.setUser(response.data.user)
            } catch (e) {
                if (e.response) {
                    this.logout()
                } else {
                    alert('Проблемы с сетью, попробуйте обновить страницу')
                }
            }
        }
    }

    async checkAuth() {
        await this.refresh()
    }

    async registerStudent(username, password, rePassword, firstName, lastName, fathersName,
                          facultyId, courseN, groupN
    ) {
        try {
            const response = await AuthService.registerStudent(username, password, rePassword,
                firstName, lastName, fathersName, facultyId, courseN, groupN)
            return [response.status, {}]
        } catch (e) {
            const response = e.response
            if (response) {
                return [response.status, response.data]
            } else {
                return [499, 'Проблема с сетью']
            }
        }
    }

    async registerTeacher(username, password, rePassword, firstName, lastName, fathersName) {
        try {
            const response = await AuthService.registerTeacher(username, password, rePassword,
                firstName, lastName, fathersName)
            return [response.status, {}]
        } catch (e) {
            const response = e.response
            if (response) {
                return [response.status, response.data]
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