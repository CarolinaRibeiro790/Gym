import { useState } from "react";
import { ScrollView, TouchableOpacity, Alert } from "react-native";
import { ScreenHeader } from "@components/ScreenHeader";
import { Center, VStack, Text, Heading, useToast } from "@gluestack-ui/themed";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ToastMessage } from "@components/ToastMessage";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { AuthContext, AuthContextDataProps } from "@contexts/AuthContext";

const PHOTO_SIZE = 33;

type FormDataProps = {
    email: string,
    name: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required("Informe o nome."),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 digitos.').nullable().transform((value) => !!value ? value : null),
    confirm_password: yup.string().nullable().transform((value) => !!value ? value : null).oneOf([yup.ref('password'), null], 'A confirmação de senha não confere').when('password', {
        is: (Field: any) => Field, //não é nulo
        then: yup.string().nullable().required('Informe a confirmação da senha.').transform((value) => !!value ? value : null)
    })
})

export function Profile() {
    const [userPhoto, setUserPhoto] = useState("https://github.com/CarolinaRibeiro790.png");

    const [isUpdating, setUpdating] = useState(false);
    const toast = useToast();
    const { user } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    });

    async function handleUserPhotoSelect() {
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            })

            if (photoSelected.canceled) {
                return
            }

            const photoURI = photoSelected.assets[0].uri;

            if (photoURI) {
                const photoInfo = await FileSystem.getInfoAsync(photoURI) as { size: number };

                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
                    return toast.show({
                        placement: "top",
                        render: ({ id }) => (
                            <ToastMessage id={id} action="error"
                                title="Imagem muito grande!"
                                description="Essa imagem é muito grande. Escolha uma de até 5MB" onClose={() => toast.close(id)} />
                        )
                    })
                }

                setUserPhoto(photoURI);
            }
        } catch (error) {
            console.log(error);
        }

    }

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setUpdating(true);

            const userUpdated = user;
            userUpdated.name = data.name;

            await api.put('/users', data);

            await updatedUserProfile(userUpdated);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.';

            Alert.alert(title);
        } finally {
            setUpdating(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={"$6"} px={"$10"}>
                    <UserPhoto
                        source={{ uri: userPhoto }} alt="Foto do usuário"
                        size="xl"
                    />
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text color="$green500" fontFamily="$heading" fontSize={"$md"} mt={"$2"} mb={"$8"}>Alterar foto</Text>
                    </TouchableOpacity>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                placeholder="Nome"
                                bg="$gray600"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                placeholder="E-mail"
                                isReadOnly
                                bg="$gray600"
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />


                    <Heading alignSelf="flex-start" fontFamily="$heading" color="$gray200" fontSize={"$md"} mt={"$12"} mb={"$2"}>Alterar senha</Heading>

                    <Center w={"$full"} gap={"$4"}>

                        <Controller
                            control={control}
                            name="old_password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Senha antiga"
                                    bg="$gray600"
                                    secureTextEntry
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Nova senha"
                                    bg="$gray600"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirm_password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder="Confirme a nova senha"
                                    bg="$gray600"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    errorMessage={errors.confirm_password?.message}
                                />
                            )}
                        />

                        <Button
                            title="Atualizar"
                            mt={4}
                            onPress={handleSubmit(handleProfileUpdate)}
                            isLoading={isUpdating}
                        />

                    </Center>
                </Center>

            </ScrollView>
        </VStack>
    )
}