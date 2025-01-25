import axios from "axios";
export const api = axios.create({
    baseURL:  'http://192.168.3.9:3333' //definir o endereço do servidor fixo
});