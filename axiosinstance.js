import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://www.google.com',
});

instance.defaults.headers.common['Authorization'] = 'Auth Token from local storage';

export default instance;