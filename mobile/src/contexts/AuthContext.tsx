import { createContext, ReactNode, useEffect, useState } from 'react';

import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser';
import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';

export type AuthContextDataProps = {
    user: UserDTO
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoadingUserStorageData: boolean
}

//Meu contexto recebe o tipo, a tipagem entre <> e as para tipar nosso valor incial.
//Meu contexto vai compartilhar dados que estão definidos na tipagem e começa como objeto vazio {}
export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type AuthContextProviderProps = {
    children: ReactNode;
}

//Função para pegar o componente filho e passar para função provider/children será as rotas 
export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    //Tipagem Login
    async function signIn(email: string, password: string) {
        try {
            //dados que o backend vai retornar
            const { data } = await api.post('/sessions', { email, password });

            //Verificar se o usuário existe
            if (data.user) {
                setUser(data.user);
                //salvar os dados no dispositivo do usuário 
                storageUserSave(data.user);
            }
        } catch (error) {
            throw error;
        }
    }


    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();

        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function loadUserData() {
        try {
            //recuperar o usuário que esta logado
            const userLogged = await storageUserGet();

            // verificar se o usuário esta logado
            if (userLogged) {
                setUser(userLogged);

            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            isLoadingUserStorageData
        }}>
            {children}
        </AuthContext.Provider>
    )
}