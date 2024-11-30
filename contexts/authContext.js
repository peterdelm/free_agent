import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "../utils/storage";
import {
  refreshAccessToken,
  loginRequest,
  verifyToken,
} from "../api/authCalls.js";
import * as SecureStore from "expo-secure-store";
import { EXPO_PUBLIC_BASE_URL } from "../.config.js";

// Create a Context for the Auth
const AuthContext = createContext();

// Create a Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedAccessToken = await AsyncStorage.getItem("accessToken");
        const storedRefreshToken = await getRefreshToken();

        if (storedUser && storedAccessToken) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedAccessToken);

          //Check Access token validity
          const isAccessTokenValid = await verifyToken(storedAccessToken);
          if (!isAccessTokenValid) {
            console.log("Token is not Valid");
            //if the access Token is invalid, check if the Refresh Token is valid
            const isRefreshTokenValid = await verifyToken(storedRefreshToken);
            if (!isRefreshTokenValid) {
              //if the Refresh Token is invalid, logout the user
              console.log("Refresh Token is invalid. Logging user out...");
              await logout();
            } else {
              //if the Refresh Token is valid, generate a new Access Token
              console.log(
                "Refresh Token is valid. Requesting new Access Token..."
              );
              const newAccessToken = await refreshAccessToken();
              console.log("New access token is", newAccessToken);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (emailAddress, password) => {
    try {
      const userData = await loginRequest(emailAddress, password);
      if (userData.status === 200) {
        await setUserContext(userData);
      } else if (userData.status === 401) {
        console.log("Incorrect Login Info");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const setUserContext = async (userData) => {
    const userContext = await userData.json();
    const accessToken = userContext.token.accessToken;
    const refreshToken = userContext.token.refreshToken;
    const user = userContext.user;

    setUser(user);
    setAccessToken(accessToken);

    await saveRefreshToken(refreshToken);
    await saveAccessToken(accessToken);
    await saveUserToStorage(user);
  };

  const logout = async () => {
    try {
      await clearUserFromStorage();
      await deleteRefreshToken();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error("Failed to  log out:", error);
    }
  };

  const updateUserRole = async (newRole) => {
    const updatedUser = { ...user, currentRole: newRole };
    setUser(updatedUser);
    await saveUserToStorage(updatedUser);
  };

  const refreshAuthToken = async () => {
    try {
      const newAccessToken = await refreshAccessToken();
      console.log("newAccessToken isFinite", newAccessToken);
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        await AsyncStorage.setItem("accessToken", newAccessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        updateUserRole,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

const getUserFromStorage = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const saveUserToStorage = async (user) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

const clearUserFromStorage = async () => {
  await AsyncStorage.removeItem("user");
};

async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync("refreshToken");
}
