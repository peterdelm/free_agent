// services/pushNotificationService.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { EXPO_PUBLIC_BASE_URL } from "../.config.js";

export async function registerForPushNotificationsAsync() {
  console.log("registerForPushNotificationsAsync called");
  let token;

  try {
    if (Device.isDevice) {
      console.log("Device is Device");

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      console.log("existingStatus is:", existingStatus);

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        console.log("existingStatus != granted!");

        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("finalStatus != granted!");

        alert("Failed to get push token for push notification!");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(
        "registerForPushNotificationsAsync called. Returning Push Token: ",
        token
      );
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  } catch (error) {
    console.error("Error in registerForPushNotificationsAsync: ", error);
    alert("An error occurred while registering for push notifications.");
  }

  return token;
}

export async function sendPushTokenToBackend(token, userId) {
  const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/api/savePushToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to send push token to backend");
  }

  return response.json();
}
