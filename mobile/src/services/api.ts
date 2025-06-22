import axios, { AxiosInstance, AxiosError } from 'axios';

import { AppError } from "@utils/AppError";
import { storageAuthTokenGet, storageAuthTokenSave } from '@storage/storageAuthToken';

type SignOut = () => void;

type PromiseType = {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}

//Lidar com o gerenciamento do token
type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut) => () => void;
};

const api = axios.create({
    baseURL: 'http://192.168.3.9:3333'
}) as APIInstanceProps;


//Criando a fila das requisições dos tokens
let failedQueue: Array<PromiseType> = [];
let isReFreshing = false;

//Verificar se o token é válido ou não
api.registerInterceptTokenManager = signOut => {
    const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {

        //Verificar se o erro é por causa de um token inválido
        if (requestError?.response.status === 401) {
            if (requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
                //recuperar o refresh token
                const { refresh_token } = await storageAuthTokenGet();

                if (!refresh_token) {
                    signOut();
                    return Promise.reject(requestError);
                }

                const originalRequestConfig = requestError.config;

                if (isReFreshing) {
                    //adicionar as requisições na fila
                    return new Promise((resolve, reject) => {
                        failedQueue.push({
                            onSuccess: (token: string) => {
                                originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` }
                            },
                            onFailure: (error: AxiosError) => {
                                reject(error);
                            },
                        })
                    })
                }

                isReFreshing = true;

                //Buscar token atualizado
                return new Promise(async (resolve, reject) => {
                    try {
                        const { data } = await api.post('/sessions/refresh-token', { refresh_token });

                        await storageAuthTokenSave({ token: data.token, refresh_token: data.refresh_token });

                        //Reenviar a requisição
                        if (originalRequestConfig.data) {
                            originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
                        }

                        originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };
                        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

                        failedQueue.forEach(request => {
                            request.onSuccess(data.token);
                        });

                        resolve(api(originalRequestConfig));

                    } catch (error: any) {
                        failedQueue.forEach(request => {
                            request.onFailure(error);
                        });

                        signOut();
                        reject(error);

                    } finally {
                        isReFreshing = false;
                        failedQueue = [];
                    }
                });
            }
            //Desloga o usuário
            signOut();
        }


        //Validação para saber se o erro é tratavel ou não
        if (requestError.response && requestError.response.data) {
            return Promise.reject(new AppError(requestError.response.data.message));
        } else {
            return Promise.reject(requestError);
        }
    });

    return () => {
        api.interceptors.response.eject(interceptTokenManager);
    };
};



export { api };