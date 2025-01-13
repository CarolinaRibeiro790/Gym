import { useState } from "react";
import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed";

import { useNavigation } from "@react-navigation/native";

import BackgroundImg from "@assets/background.png";
import Logo from "../assets/logo.svg"

import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack();
    }

    function handleSignUp() {
        console.log({
            name,
            email,
            password,
            passwordConfirm
        });
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
        >
            <VStack flex={1}>
                <Image w={"$full"} h={624}
                    opacity={0.5}
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    position="absolute"
                />
                <VStack flex={1} px={"$10"} pb={"$10"}>
                    <Center my={"$24"}>
                        <Logo />
                        <Text color="$gray100" fontSize={"$sm"}>
                            Treine sua mente e o seu corpo.
                        </Text>
                    </Center>

                    <Center gap={"$5"} >
                        <Heading color="$gray100">Crie sua conta</Heading>

                        <Input
                            placeholder="Nome"
                            onChangeText={setName}
                        />

                        <Input placeholder="E-mail"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={setEmail}
                        />

                        <Input
                            placeholder="Senha"
                            secureTextEntry
                            onChangeText={setPassword}
                        />

                        <Input
                            placeholder="Confirme a senha"
                            secureTextEntry
                            onChangeText={setPasswordConfirm}
                        />

                        <Button
                            title="Criar e acessar"
                            onPress={handleSignUp}
                        />

                    </Center>
                    <Center flex={1} justifyContent="flex-end" mt={"$4"} >
                        <Button title="Voltar para o login" variant="outline" mt={"$12"} onPress={handleGoBack} />
                    </Center>

                </VStack>
            </VStack>
        </ScrollView>
    )
}