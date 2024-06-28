import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";

const getCurrentUser = async () => {
  const url = `${EXPO_PUBLIC_BASE_URL}api/users/`;
  console.log("getCurrentUser called using url " + url);

  try {
    // Make the fetch request using async/await
    const response = await authFetch(url);

    if (response.success) {
      // Parse and use the data
      return response;
    } else {
      // Handle non-ok responses
      console.log("Problem with response: ", response);
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    // Handle errors from AsyncStorage or fetch operation
    console.log("Error in getCurrentUser:", error);
    return null;
  }
};

export default getCurrentUser;
