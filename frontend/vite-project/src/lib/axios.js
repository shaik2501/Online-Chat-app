import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"https://online-chat-app-gwep.onrender.com",
    withCredentials:true, //send cookies
})
