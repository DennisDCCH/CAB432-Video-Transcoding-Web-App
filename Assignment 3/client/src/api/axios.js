import axios from "axios"
const { baseURL } = require('../Baseurl')

const BASE_URL = baseURL + '/api/'

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});