import { EXPO_PUBLIC_BASE_URL } from "../.config.js";
import authFetch from "../api/authCalls.js";

const url = `${EXPO_PUBLIC_BASE_URL}api/users/pushToken`;

export const sendPushTokenToBackend = async ({ expoPushToken, user }) => {
  console.log("sendPushTokenToBackends has been called! ");
  const { userId } = user;
  try {
    console.log("user is", user);

    const response = await authFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, expoPushToken }),
    });
    console.log("ExpoPushToken is", expoPushToken);

    if (response.status === 200) {
      const userData = await response.json();
      return userData;
    } else if (response.status === 401) {
      throw new Error("Invalid credentials");
    } else {
      throw new Error("Unexpected response");
    }
  } catch (error) {
    console.log("sendPushNotification errored out with", error);
  }
};
