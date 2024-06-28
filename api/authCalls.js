import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "../utils/storage.js";
import { EXPO_PUBLIC_BASE_URL } from "../.config.js";

export const loginRequest = async (emailAddress, password) => {
  const url = `${EXPO_PUBLIC_BASE_URL}api/users/id`;
  try {
    console.log("Attempting Auth Fetch");
    const response = await authFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailAddress, password }),
    });

    if (response.status === 200) {
      const userData = await response.json();
      return userData;
    } else if (response.status === 401) {
      throw new Error("Invalid credentials");
    } else {
      throw new Error("Unexpected response");
    }
  } catch (error) {
    console.error("Failed to log in:", error);
    throw error;
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      await storeTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } else {
      console.error("Failed to refresh access token:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

const authFetch = async (url, options = {}) => {
  console.log("Authfetch URL is:", url);
  console.log("Authfetch Options are:", options);

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Get the access token and add it to the headers
  const accessToken = await getAccessToken();

  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  // Merge the default headers with any custom headers provided
  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  let response = await fetch(url, options);

  // Check if the response status is 401 (Unauthorized) which indicates the token might be expired
  if (response.status === 401) {
    // Try to refresh the token
    console.log("Response status is 401. Attempting to refresh token...");
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const refreshResponse = await fetch(
        `${EXPO_PUBLIC_BASE_URL}api/users/refreshToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      if (refreshResponse.status === 200) {
        const refreshData = await refreshResponse.json();
        const { token: newAccessToken } = refreshData;

        // Save the new access token
        await saveAccessToken(newAccessToken);

        // Update the original request headers with the new access token
        options.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        response = await fetch(url, options);
      } else {
        // Refresh token is invalid or expired, handle logout or re-authentication
        console.error(
          "Response status for refreshResponse was not 200. Response was: ",
          refreshResponse
        );
        throw new Error("Refresh token is invalid or expired");
      }
    } else {
      // No refresh token available, handle logout or re-authentication
      console.error("No refresh token available");
      throw new Error("No refresh token available");
    }
  }
  response = await response.json();
  console.log("response is", response);
  return response;
};

export default authFetch;
