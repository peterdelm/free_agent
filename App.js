import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./components/screens/WelcomeScreen";
import HomeScreen from "./components/screens/Home";
import CreateGame from "./components/screens/CreateGame";
import CreateUser from "./components/screens/CreateUser";
import ViewGame from "./components/screens/ViewGame";
import ViewPlayer from "./components/screens/ViewPlayer";
import EditPlayer from "./components/screens/EditPlayer";
import CreatePlayer from "./components/screens/CreatePlayer";
import ManagePlayers from "./components/screens/ManagePlayers";
import BrowseAvailableGames from "./components/screens/BrowseAvailableGames";
import ManagerBrowseGames from "./components/screens/ManagerBrowseGames";
import InboxScreen from "./components/screens/InboxScreen";
import PlayerHome from "./components/screens/PlayerHome";

import { BrowserRouter as Router, Route } from "react-router-dom";
import UserProfile from "./components/screens/UserProfile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
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
          name="RegisterUser"
          component={CreateUser}
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
        <Stack.Screen
          name="PlayerHome"
          component={PlayerHome}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
