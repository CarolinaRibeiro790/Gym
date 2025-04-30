import { useState } from "react";
import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";

import BackgroundImg from "@assets/background.png";
import Logo from "../assets/logo.svg"

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { isLoading } from "expo-font";

type FormData = {
    email: string;
    password: string;
}


//Definir o padrão dos dados 
const signUpSchema = yup.object({
    email: yup.string().required('Informe o e-mail.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.')
})

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();

    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const toast= useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

    function handleNewAccount() {
        navigation.navigate("signUp")
    }

    async function handleSignIn({ email, password }: FormData) {
        try {
            setIsLoading(true);
            await signIn(email, password);
            console.log(email, password)

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.';

            setIsLoading(false);

            Alert.alert(title);
           
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
        >
            <VStack flex={1}>
                <Image w={"$full"} h={624} opacity={0.5}
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    position="absolute"
                />
                <VStack flex={1} px={"$10"} pb={"$16"}>
                    <Center my={"$24"}>
                        <Logo />
                        <Text color="$gray100" fontSize={"$sm"}>
                            Treine sua mente e o seu corpo.
                        </Text>
                    </Center>

                    <Center gap={"$5"} mt={"$10"} pt={"$6"}>
                        <Heading color="$gray100">Acesse a conta</Heading>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input placeholder="E-mail"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Senha"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Button
                            title="Acessar"
                            onPress={handleSubmit(handleSignIn)}
                            isLoading = {isLoading}
                        />

                    </Center>

                    <Center flex={1} justifyContent="flex-end" mt={"$4"} >
                        <Text color="$gray100" fontSize="$sm" mb={"$3"} fontFamily="$body">Ainda não tem acesso?</Text>
                        <Button title="Criar Conta" variant="outline" onPress={handleNewAccount} />
                    </Center>
                </VStack>
            </VStack>
        </ScrollView>
    )
}