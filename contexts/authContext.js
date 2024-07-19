import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
} from "../utils/storage";
import { refreshAccessToken, loginRequest } from "../api/authCalls.js";
import * as SecureStore from "expo-secure-store";

// Create a Context for the Auth
const AuthContext = createContext();

// Create a Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        console.log("storedUser is", storedUser);
        const storedAccessToken = await AsyncStorage.getItem("accessToken");

        if (storedUser && storedAccessToken) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedAccessToken);
        }
      } catch (error) {
        console.error("Error loading storage data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (emailAddress, password) => {
    try {
      const userData = await loginRequest(emailAddress, password);
      if (userData.status === 200) {
        console.log("userData.success === true");

        setUserContext(userData);
      } else if (userData.status === 401) {
        console.log("Incorrect Login Info");
      }
      console.log("Userd data is:", userData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const setUserContext = async (userData) => {
    const userContext = await userData.json();
    console.log("userData is", userContext);

    const accessToken = userContext.token.accessToken;
    const refreshToken = userContext.token.refreshToken;
    const user = userContext.user;
    console.log("Refresh token received. Saving to backend: ", refreshToken);

    setUser(user);

    await saveRefreshToken(refreshToken);
    await saveAccessToken(accessToken);
    await saveUserToStorage(user);
  };

  const logout = async () => {
    try {
      await clearUserFromStorage();
      deleteRefreshToken();
      setUser(null);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const updateUserRole = async (newRole) => {
    const updatedUser = { ...user, currentRole: newRole };
    setUser(updatedUser);
    await saveUserToStorage(updatedUser);
  };

  const refreshAuthToken = async () => {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      setAccessToken(newAccessToken);
      await AsyncStorage.setItem("accessToken", newAccessToken);
    } else {
      setUser(null);
      setAccessToken(null);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("accessToken");
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
        refreshAuthToken,
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

// Function to delete the refresh token (e.g., during logout)
async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync("refreshToken");
}
