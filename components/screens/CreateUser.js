import React, { useState } from "react";
import { View, TextInput, Button, TouchableOpacity, Text } from "react-native";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

const CreateUser = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const url = `${EXPO_PUBLIC_BASE_URL}api/users`;

  const storeSessionToken = async (token) => {
    try {
      await AsyncStorage.setItem("@session_token", token);
      console.log("Session token stored successfully.");
      return true;
    } catch (error) {
      console.log("Error storing session token:", error);
      return false;
    }
  };

  const validateInputs = () => {
    if (!emailAddress || !validateEmail(emailAddress)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return false;
    }

    if (
      password.length < 7 ||
      !/\d/.test(password) ||
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
    ) {
      setErrorMessage(
        "Password must be at least 7 characters long and contain at least one number and one symbol."
      );
      return false;
    }

    setErrorMessage("");
    return true;
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async () => {
    try {
      if (!validateInputs()) {
        return;
      }

      const body = {
        firstName,
        lastName,
        emailAddress,
        password,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      console.log("Submit successful");
      console.log("User created with token: " + data.token);

      const successfulStorage = await storeSessionToken(data.token);

      if (successfulStorage) {
        console.log("Storage was successful");
        navigation.navigate("Home", {
          successMessage: "User created successfully.",
        });
      }
    } catch (error) {
      console.error("Error making authenticated request:", error);
    }
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="First Name"
          onChangeText={(firstName) => setFirstName(firstName)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Last Name"
          onChangeText={(lastName) => setLastName(lastName)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Email..."
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        <TouchableOpacity>
          <Button title="REGISTER ACCOUNT" onPress={() => onSubmit()} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateUser;
