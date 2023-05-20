import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/invoice'

const create = newObject => {
    const request = axios.post(`${baseUrl}`, newObject)
    return request.then(response => response.data)
}

// eslint-disable-next-line
export default {create}