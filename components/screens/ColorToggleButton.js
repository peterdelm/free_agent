import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ColorToggleButton = ({ user }) => {
  const [isEnabled, setIsEnabled] = useState(user.isActive);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    if (user && user.isActive !== undefined) {
      setIsEnabled(user.isActive);
      setCurrentUser(user);
    }
  }, [user]);
  console.log("User status is", user.isActive);
  const getTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem("@session_token");
      console.log("Token is " + token);
      return token;
    } catch (error) {
      console.log("Error retrieving token from AsyncStorage:", error);
      return null;
    }
  };

  const onToggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    statusToggleRequest();
  };

  const url = `${EXPO_PUBLIC_BASE_URL}api/users/${currentUser.id}/togglePlayerStatus`;

  const statusToggleRequest = async () => {
    try {
      const token = await getTokenFromStorage();
      console.log("Token is " + token);
      console.log("URL is " + url);
      console.log("statusToggleRequest called!");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestOptions = {
        method: "PUT",
        headers,
      };

      const res = await fetch(url, requestOptions);

      if (res.ok) {
        const data = await res.json();
        if (data.success === true) {
          console.log("Submit successful");
        } else {
          // Revert the state if the request fails
          setIsEnabled((previousState) => !previousState);
        }
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.log("Error making authenticated request:", error);

      setIsEnabled((previousState) => !previousState);
    }
  };

  // if (!user || user.isActive === undefined) {
  //   return null; // or render a loading indicator
  // }

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isEnabled ? "green" : "red" },
        ]}
        onPress={onToggleSwitch}
      >
        <Text style={styles.buttonText}>{isEnabled ? "ON" : "OFF"}</Text>
      </TouchableOpacity> */}
      <Switch
        trackColor={{ false: "red", true: "green" }}
        thumbColor={isEnabled ? "green" : "red"}
        ios_backgroundColor="red"
        onValueChange={onToggleSwitch}
        value={isEnabled}
      />
      <Text style={[styles.buttonText, { color: isEnabled ? "green" : "red" }]}>
        {isEnabled ? "Active" : "Inactive"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    flex: 1,
  },
  // button: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   marginRight: 10,
  // },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ColorToggleButton;
