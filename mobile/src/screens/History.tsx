import { useState, useCallback } from "react";
import { SectionList, Alert } from "react-native";
import { AppError } from "@utils/AppError";
import { Heading, VStack, Text } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { api } from "@services/api";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { Loading } from '@components/Loading';

export function History() {
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchHistory() {
        try {
            setIsLoading(true);
            const response = await api.get('/history');
            setExercises(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível carregar o histórico.'

            Alert.alert(title)
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory();
    }, []));

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercícios" />
            {
                isLoading ? <Loading /> :

                    <SectionList
                        sections={exercises}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <HistoryCard data={item}
                            />)}
                        renderSectionHeader={({ section }) => (
                            <Heading color={"$gray200"} fontSize={"$md"} mt={"$10"} mb={"$3"} fontFamily="$heading">{section.title}</Heading>
                        )}
                        style={{ paddingHorizontal: 32 }}
                        contentContainerStyle={
                            exercises.length === 0 && { flex: 1, justifyContent: "center" }
                        }
                        ListEmptyComponent={() => (
                            <Text color="$gray100" textAlign="center">Não há exercícios registrados ainda. {"\n"} Vamos fazer exercícios hoje?</Text>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
            }
        </VStack>
    )
}