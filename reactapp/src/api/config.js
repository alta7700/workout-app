import axios from "axios";

const HOST = "192.168.0.102:8000"


export const HTTP_ADDRESS = `http://${HOST}`
export const API_WS = `ws://${HOST}/api`

const API_HTTP = `${HTTP_ADDRESS}/api`


const api = axios.create({
    baseURL: API_HTTP,
})

api.interceptors.request.use((config) => {
    let accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.Token = `Bearer ${localStorage.getItem('accessToken')}`
    }
    return config
})


export default api


export function urlWithQ(url, q) {
    if (q) {
        let qStr = '?'
        Object.entries(q).map(([key, value]) =>
            qStr = `${qStr}${key}=${value}&`
        )
        return url + qStr.slice(0, qStr.length - 1)
    }
    return url
}
