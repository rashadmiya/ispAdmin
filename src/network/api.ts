import Axios from 'axios';

import { baseURL } from '../constants/baseURL';

const api = Axios.create({
    baseURL: baseURL,
});
api.interceptors.request.use(
    async config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

export default api;