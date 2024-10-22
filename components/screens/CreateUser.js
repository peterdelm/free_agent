import React, { useState } from "react";
import { View, TextInput, Button, TouchableOpacity, Text } from "react-native";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import { useAuth } from "../../contexts/authContext";

function CreateUser({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const url = `${EXPO_PUBLIC_BASE_URL}api/users`;

  const storeSessionToken = async (token) => {
    try {
      const tokenString =
        typeof token === "string" ? token : JSON.stringify(token);
      await AsyncStorage.setItem("@session_token", tokenString);
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
      if (loading || !validateInputs()) {
        return;
      }

      setLoading(true);

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
        if (response.status === 409) {
          const data = await response.json();

          setErrorMessage(data.message);
        } else {
          throw new Error("Network response was not ok.");
        }
      }

      if (response.status === 200) {
        const data = await response.json();
        console.log("Submit successful");
        console.log("User created with token: " + data.token);

        const successfulStorage = await storeSessionToken(data.token);

        if (successfulStorage) {
          const user = await login(emailAddress, password);
          console.log("User is, ", user);
          console.log("Storage was successful");

          if (user) {
            navigation.navigate("ManagerHome", {
              successMessage: "User created successfully.",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error making authenticated request:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
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
          secureTextEntry={true}
        />
      </View>
      <View>
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        <TouchableOpacity disabled={loading}>
          <Button
            title={loading ? "Loading..." : "REGISTER ACCOUNT"}
            onPress={() => onSubmit()}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CreateUser;
