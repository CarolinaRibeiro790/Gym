import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { Platform } from "react-native";

import HomeSvg from "@assets/home.svg";
import HistorySvg from "@assets/history.svg";
import ProfileSvg from "@assets/profile.svg";

import { Home } from "@screens/Home";
import { Profile } from "@screens/Profile";
import { History } from "@screens/History";
import { Exercise } from "@screens/Exercise";

type AppRoutes = {
    home: undefined,
    exercise: undefined,
    profile: undefined,
    history: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
    const { tokens } = gluestackUIConfig;
    const iconSize = tokens.space["6"]
    return (
        <Navigator screenOptions={{
            headerShown: false, //Remove o cabeçalho de todas as páginas
            tabBarShowLabel: false, //Remove a parte escrita da bottomTab, aparece só o icone
            tabBarActiveTintColor: tokens.colors.green500, //Cor dos icones selecionados
            tabBarInactiveTintColor: tokens.colors.gray200, //Cor dos icones não selecionados
            //Estilizando a cor de fundo
            tabBarStyle: {
                backgroundColor: tokens.colors.gray600,
                borderTopWidth: 0,
                height: Platform.OS === "android" ? 80 : 96,
                paddingBottom: tokens.space["10"],
                paddingTop: tokens.space["6"],
                justifyContent: 'space-around',
               paddingInlineStart: 90
            },
        }}>
            <Screen
                name="home"
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => <HomeSvg fill={color} width={iconSize} height={iconSize} />
                }}
            />
            <Screen
                name="history"
                component={History}
                options={{
                    tabBarIcon: ({ color }) => <HistorySvg fill={color} width={iconSize} height={iconSize} />
                }}
            />
            <Screen
                name="profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color }) => <ProfileSvg fill={color} width={iconSize} height={iconSize} />
                }}
            />
            <Screen
                name="exercise"
                component={Exercise}
                options={{
                    tabBarButton: () => null,
                }}
            />

        </Navigator>
    )
}