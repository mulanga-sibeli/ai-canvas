import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {Platform, StyleSheet} from "react-native";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "@expo/metro-runtime";

SplashScreen.preventAutoHideAsync().then();
export default function RootLayout() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    const [loaded, error] = useFonts({
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            setLoadingComplete(true);
            SplashScreen.hideAsync().then();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    if (!isLoadingComplete) {
        return (
            <View style={styles.activityIndicator}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return (
        <ThemeProvider value={DefaultTheme}>
            {
                Platform.OS == "web" &&
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                </Stack>
            }
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    activityIndicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
