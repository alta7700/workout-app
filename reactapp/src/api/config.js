import axios from "axios";
import Qs from "qs";

const HOST = "192.168.0.102:8000"


export const HTTP_ADDRESS = `http://${HOST}`
const API_HTTP = `${HTTP_ADDRESS}/api`
export const API_WS = `ws://${HOST}/api`


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
