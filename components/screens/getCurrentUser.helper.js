import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

const getCurrentUser = async () => {
  const url = `${EXPO_PUBLIC_BASE_URL}api/users/`;
  console.log("getCurrentUser called using url " + url);

  try {
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem("@session_token");
    console.log("Token is " + token);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Make the fetch request using async/await
    const response = await fetch(url, { headers });
    console.log("User response is: " + response);

    if (response.ok) {
      // Parse and use the data
      const userData = await response.json();
      console.log("User data:", userData);
      return userData;
    } else {
      // Handle non-ok responses
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    // Handle errors from AsyncStorage or fetch operation
    console.log("Error:", error);
    return null;
  }
};

export default getCurrentUser;
