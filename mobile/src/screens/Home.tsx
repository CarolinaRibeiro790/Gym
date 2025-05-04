import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

export function Home() {
    const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [groupSelected, setGroupSelected] = useState("antebraço");
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails(exerciseId: string) {
        navigation.navigate("exercise", {exerciseId});
    };

    async function fetchGroups() {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.'

            Alert.alert(title)

        }
    }

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true);
            const response = await api.get(`/exercises/bygroup/${groupSelected}`);

            setExercises(response.data)
        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.'

            Alert.alert(title)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]));

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={groupSelected.toLowerCase() === item.toLowerCase()}
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 32 }}
                style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
            />
            {isLoading ? <Loading /> :
                <VStack px={"$8"} flex={1} >
                    <HStack justifyContent="space-between" mb={"$5"} alignItems="center">
                        <Heading color="$gray200" fontSize={"$md"} fontFamily="$heading" >Exercícios</Heading>
                        <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercises.length}</Text>
                    </HStack>

                    <FlatList
                        data={exercises}
                        keyExtractor={item => item.id}

                        renderItem={({ item }) => (
                            <ExerciseCard
                                onPress={() => handleOpenExerciseDetails(item.id)}
                                data={item}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />

                </VStack>
            }
        </VStack>
    )
}