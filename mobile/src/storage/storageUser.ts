import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from "@dtos/UserDTO";
import { USER_STORAGE } from '@storage/storageConfig';

//método para salvar 
export async function storageUserSave(user: UserDTO) {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

//método para buscar 
export async function storageUserGet() {
    const storage = await AsyncStorage.getItem(USER_STORAGE);

    //verificar se tem conteudo dentro da cache
    const user: UserDTO = storage ? JSON.parse(storage) : {};
    return user;
}

//método para remover o usuário logado
export async function storageUserRemove() {
    await AsyncStorage.removeItem(USER_STORAGE);
}