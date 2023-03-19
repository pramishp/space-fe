import axios from "axios";


// since this instance will be used for things that do not need user authentication we dont
const axiosInstance = axios.create(
    {
        baseURL: 'http://127.0.0.1:8000',
    }
)

export default axiosInstance;
