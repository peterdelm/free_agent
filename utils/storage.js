import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const saveAccessToken = async (accessToken) => {
  console.log("Saving accessToken: ", accessToken);
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

export const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    return accessToken;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

// Function to get the refresh token from secure storage
export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync("refreshToken");
};

// Function to save the refresh token
export const saveRefreshToken = async (refreshToken) => {
  await SecureStore.setItemAsync("refreshToken", refreshToken);
};
