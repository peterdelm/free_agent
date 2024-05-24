import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./components/screens/WelcomeScreen.js";
import HomeScreen from "./components/screens/Home.js";
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

import { BrowserRouter as Router, Route } from "react-router-dom";
import UserProfile from "./components/screens/UserProfile.js";
import * as Linking from "expo-linking";

import { usePushNotifications } from "./components/screens/usePushNotifications";

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: { seconds: 2 },
  });
}

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL("/");

export default function App() {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        NewPasswordScreen: "NewPasswordScreen",
      },
    },
  };

  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator>
        <Stack.Screen
          name="WelcomeScreen"
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
        <Stack.Screen
          name="PlayerBrowseGames"
          component={PlayerBrowseGames}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>
            Title: {notification && notification.request.content.title}{" "}
          </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>
            Data:{" "}
            {notification && JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text>Token: {expoPushToken?.data ?? ""}</Text>
        <Text>Notification: {data}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
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
