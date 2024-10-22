import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { router } from "expo-router";
// Define the type for the navigation parameters
type RootStackParamList = {
  ViewPlayer: { playerId: string };
};

// Get the navigation prop's type
type NavigationProp = StackNavigationProp<RootStackParamList>;

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  const navigation = useNavigation<NavigationProp>(); // Specify the type of navigation prop
  console.log("Attempting to usePushNotifications");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      console.log("Must be using a physical device for Push notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log(`Attempting to registerForPushNotificationsAsync`);

      setExpoPushToken(token);
    });

    let isMounted = true;
    ///////
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log(`Attempting to addNotificationReceivedListener`);
      });

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        redirect(response.notification);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
    ///////
    //Previous Code
    ////////
  }, []);

  return {
    expoPushToken,
    notification,
  };
};

//   const subscription = Notifications.addNotificationResponseReceivedListener(
//     (response) => {
//       console.log(`Attempting to addNotificationResponseReceivedListener`);

//       const url = response.notification.request.content.data.url;
//       Linking.openURL(url);
//     }
//   );
//   return () => subscription.remove();

// notificationListener.current =
//   Notifications.addNotificationReceivedListener((notification) => {
//     console.log(`Attempting to setNotification`);

//     setNotification(notification);
//   });

// responseListener.current =
//   Notifications.addNotificationResponseReceivedListener((response) => {
//     console.log(`Attempting to open URL`);

//     // const data = response.notification.request.content.data;
//     // if (data && data.screen === "ViewPlayer" && data.playerId) {
//     //   console.log(
//     //     `Attempting to navigate to ViewPlayer with playerId: ${data.playerId}`
//     //   );
//     //   navigation.navigate("ViewPlayer", { playerId: data.playerId });
//     // } else if (data && data.url) {
//     //   console.log(`Attempting to open URL: ${data.url}`);
//     //   Linking.openURL(data.url);
//     // }
//   });

// return () => {
//   Notifications.removeNotificationSubscription(
//     notificationListener.current!
//   );

//   Notifications.removeNotificationSubscription(responseListener.current!);
// };
