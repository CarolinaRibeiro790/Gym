import axios from "axios";

import { AppError } from "@utils/AppError";

const api = axios.create({
    baseURL: 'http://192.168.3.9:3333' //definir o endereço do servidor fixo
});


api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message));
    }else{
        return Promise.reject(error);
        //return Promise.reject(new AppError('Erro no servidor. Tente novamente mais tarde.')); //tratada
    }
});

export { api };