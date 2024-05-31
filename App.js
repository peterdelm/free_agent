import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./components/screens/WelcomeScreen.js";
import ManagerHome from "./components/screens/ManagerHome.js";
import CreateGame from "./components/screens/CreateGame.js";
import CreateUser from "./components/screens/CreateUser.js";
import ViewGame from "./components/screens/ViewGame.js";
import ViewPlayer from "./components/screens/ViewPlayer.js";
import EditPlayer from "./components/screens/EditPlayer.js";
import CreatePlayer from "./components/screens/CreatePlayer.js";
import ManagePlayers from "./components/screens/ManagePlayers.js";
import BrowseAvailableGames from "./components/screens/BrowseAvailableGames.js";
import ManagerBrowseGames from "./components/screens/ManagerBrowseGames.js";
import InboxScreen from "./components/screens/InboxScreen.js";
import PlayerHome from "./components/screens/PlayerHome.js";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen.js";
import NewPasswordScreen from "./components/screens/NewPasswordScreen.js";
import PlayerBrowseGames from "./components/screens/PlayerBrowseGames.js";

import UserProfile from "./components/screens/UserProfile.js";
import * as Linking from "expo-linking";
import { AuthProvider, useAuth } from "./contexts/authContext";
import {
  registerForPushNotificationsAsync,
  sendPushTokenToBackend,
} from "./services/pushNotificationService.js";
import { loginRequest } from "./api/authCalls.js";
import { usePushNotifications } from "./components/screens/usePushNotifications.tsx";
const Stack = createNativeStackNavigator();

const prefix = Linking.createURL("/");

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterUser"
        component={CreateUser}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewPasswordScreen"
        component={NewPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ManagerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ManagerHome"
        component={ManagerHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateGame"
        component={CreateGame}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreatePlayer"
        component={CreatePlayer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewGame"
        component={ViewGame}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewPlayer"
        component={ViewPlayer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPlayer"
        component={EditPlayer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManagePlayers"
        component={ManagePlayers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InboxScreen"
        component={InboxScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrowseAvailableGames"
        component={BrowseAvailableGames}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManagerBrowseGames"
        component={ManagerBrowseGames}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function PlayerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlayerHome"
        component={PlayerHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlayerBrowseGames"
        component={PlayerBrowseGames}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewGame"
        component={ViewGame}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewPlayer"
        component={ViewPlayer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPlayer"
        component={EditPlayer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManagePlayers"
        component={ManagePlayers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InboxScreen"
        component={InboxScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrowseAvailableGames"
        component={BrowseAvailableGames}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainApp() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const registerAndSendToken = async () => {
      console.log("registerAndSendToken called");

      const token = await registerForPushNotificationsAsync();
      // const { expoPushToken, notification } = usePushNotifications();
      // console.log("expoPushToken is", expoPushToken);
      if (token && user) {
        try {
          await sendPushTokenToBackend(token, user.id);
          console.log("Push token sent to backend successfully");
        } catch (err) {
          console.error("Failed to send push token to backend:", err);
        }
      }
    };

    if (!loading && user) {
      registerAndSendToken();
    }
  }, [loading, user]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer
      linking={{
        prefixes: [prefix],
        config: { screens: { NewPasswordScreen: "NewPasswordScreen" } },
      }}
      fallback={<Text>Loading...</Text>}
    >
      {user ? ( // Check if a user is logged in
        user.currentRole === "manager" ? ( // If the user is a manager
          <>
            {/* // Render the ManagerStack navigator */}
            <ManagerStack />
          </>
        ) : user.currentRole === "player" ? ( // If the user is a player
          <>
            {/* // Render the PlayerStack navigator */}
            <PlayerStack />
          </>
        ) : (
          <AuthStack /> // If the user role is neither manager nor player, render the AuthStack
        )
      ) : (
        <AuthStack /> // If no user is logged in, render the AuthStack
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
