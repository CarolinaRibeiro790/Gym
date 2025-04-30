import {useContext} from 'react';
import { AuthContext } from '@contexts/AuthContext'; 

//compartilhar o contexto de autenticaça~p
export function useAuth(){
    const context = useContext(AuthContext);

    return context;
}