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
import CreatePlayer from "./components/screens/CreatePlayer";
import ManagePlayers from "./components/screens/ManagePlayers";

import { BrowserRouter as Router, Route } from "react-router-dom";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateGame" component={CreateGame} />
        <Stack.Screen name="CreatePlayer" component={CreatePlayer} />
        <Stack.Screen name="RegisterUser" component={CreateUser} />
        <Stack.Screen name="ViewGame" component={ViewGame} />
        <Stack.Screen name="ManagePlayers" component={ManagePlayers} />
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
