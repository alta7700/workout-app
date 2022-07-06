import api from "./config";


export async function getFaculties() {
    try {
        const response = await api.get('/faculties/')
        return [response.status, response.data]
    } catch (e) {

    }
}