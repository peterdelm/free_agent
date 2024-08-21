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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailAddress, password }),
    });

    console.log("Response in loginRequest is", response);

    if (response.status === 200) {
      return response;
    } else if (response.status === 401) {
      return response;
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
    //attempt to refresh the Access Token
    console.log("Calling refreshAccessToken");
    const response = await fetch(
      `${EXPO_PUBLIC_BASE_URL}api/users/refreshToken`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      await storeTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    }
    if (refreshResponse.status === 403) {
      // Refresh token is invalid or expired, handle logout or re-authentication
      return false;
    } else {
      console.error("Failed to refresh access token:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

export const verifyToken = async (token) => {
  console.log("calling checkToken validity");

  try {
    const response = await fetch(
      `${EXPO_PUBLIC_BASE_URL}api/users/verifyToken`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.status);
    if (response.status === 200) {
      return true;
    }
    if (response.status === 403) {
      console.log("Token Expired");
      return false;
    }
  } catch (error) {
    console.error("Error verifying to token:", error);
    return false;
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
    console.log("Refresh Token is", refreshToken);
    if (refreshToken) {
      console.log("Sending request to refresh AuthToken");
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

      // console.log("refreshResponse.status  is ", refreshResponse.status);

      if (refreshResponse.status === 200) {
        const refreshData = await refreshResponse.json();
        const { token: newAccessToken } = refreshData;

        // Save the new access token
        await saveAccessToken(newAccessToken);

        // Update the original request headers with the new access token
        options.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        response = await fetch(url, options);
      } else if (refreshResponse.status === 401) {
        console.log(
          "Users Refresh Token is Expired With Status 401. Returning False"
        );
        return refreshResponse;
      } else if (refreshResponse.status === 403) {
        console.log(
          "Users Refresh Token is Expired With Status 403. Returning False"
        );
        return refreshResponse;
      } else {
        console.error(
          "Response status for refreshResponse was not 200. Response was: ",
          refreshResponse
        );
        // throw new Error("Refresh token is invalid or expired");
      }
    } else {
      // No refresh token available, handle logout or re-authentication
      console.error("No refresh token available");
      throw new Error("No refresh token available");
    }
  }
  // Parse response body as text to preserve original response
  const responseText = await response.text();

  // Convert text to JSON if the content type is JSON
  let responseBody;
  try {
    responseBody = JSON.parse(responseText);
  } catch (e) {
    // Handle cases where the response is not JSON
    responseBody = responseText;
  }

  console.log("response status is", response.status);
  console.log("response body is", responseBody);

  return {
    status: response.status,
    body: responseBody,
  };
};

export default authFetch;
