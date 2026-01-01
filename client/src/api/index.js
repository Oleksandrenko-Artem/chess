import axios from 'axios';
import queryString from 'query-string';
import { baseUrl } from '../constants';

const apiClient = axios.create({
    baseURL: baseUrl.BASE_URL,
});
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});
export const registerUser = (values) => apiClient.post('/users/register', values);
export const loginUser = (values) => apiClient.post('/users/login', values);
export const findUserAccount = () => apiClient.get('/users/account');
export const findAllUsers = (values) => {
    const query = queryString.stringify(values);
    return apiClient.get(`/users/${query}`);
};
export const updateUser = (id, values) => apiClient.patch(`/users/${id}`, values);