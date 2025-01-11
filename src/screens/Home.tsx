import { useState } from "react";
import { HStack, VStack } from "@gluestack-ui/themed";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";


export function Home() {
    const [groupSelected, setGroupSelected] = useState();
    return (
        <VStack flex={1}>
            <HomeHeader />

            <HStack>
                <Group name="Costas"
                    isActive={groupSelected === "costa"}
                    onPress={() => setGroupSelected("costa")}
                />

                <Group name="Ombro"
                    isActive={groupSelected === "ombro"}
                    onPress={() => setGroupSelected("ombro")}
                />
            </HStack>

        </VStack>
    )
}