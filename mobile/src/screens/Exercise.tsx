import { TouchableOpacity, ScrollView } from "react-native";
import { HStack, VStack, Icon, Heading, Text, Image, Box } from "@gluestack-ui/themed";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";

export function Exercise() {

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleGoBack() {
        navigation.goBack();
    }

    return (
        <VStack flex={1}>

            <VStack px={"$8"} bg="$gray600" pt={"$12"}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={ArrowLeft} color="$green500" size="xl" />
                </TouchableOpacity>

                <HStack justifyContent="space-between" alignItems="center" mt="$4" mb="$8" >

                    <Heading color="$gray100" fontFamily="$heading" fontSize={"$lg"} flexShrink={1}>Puxada frontal</Heading>

                    <HStack alignItems="center">
                        <BodySvg />
                        <Text color="$gray200" ml={"$1"} >Costas</Text>
                    </HStack>
                </HStack>

            </VStack>

            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                <VStack p="$8">
                    <Image
                        source={{
                            uri: "https://static.strengthlevel.com/images/exercises/close-grip-lat-pulldown/close-grip-lat-pulldown-800.jpg"
                        }}
                        alt="Exercicio"
                        mb={"$3"}
                        resizeMode="cover"
                        rounded="$lg"
                        w={"$full"}
                        h={"$80"}
                    />

                    <Box bg="$gray600" rounded={"$md"} pb={"$4"} px={"$4"}>

                        <HStack alignItems="center" justifyContent="space-around" mb={"$6"} mt={"$5"}>
                            <HStack>
                                <SeriesSvg />
                                <Text color="$gray200" ml={"$2"}>3 séries</Text>
                            </HStack>

                            <HStack >
                                <RepetitionSvg />
                                <Text color="$gray200" ml={"$2"}>12 repetições</Text>
                            </HStack>
                        </HStack>

                        <Button title="Marcar como realizado" />

                    </Box>
                </VStack>
            </ScrollView>
        </VStack>
    )
}