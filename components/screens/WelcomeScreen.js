import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

function WelcomeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [token, setToken] = useState("");

  const storeSessionToken = async (token) => {
    try {
      await AsyncStorage.setItem("@session_token", token);
      console.log("Session token stored successfully.");
      return true;
    } catch (error) {
      console.error("Error storing session token:", error);
      return false;
    }
  };

  const handleLoginAttempt = async (emailAddress, password) => {
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/users/id";

    const credentials = { emailAddress, password };
    console.log("handleLoginAttempt called");
    console.log(credentials);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else if (response.status === 401) {
        // Extract and display the error message from the response
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      } else {
        console.log("Unexpected response:", response.status);
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.log("Error during login attempt:", error);
      throw new Error("An unexpected error occurred");
    }
  };

  const authenticateUser = async (token) => {
    console.log("Token is : " + token);
    setToken(token);
    const successfulStorage = await storeSessionToken(token);

    if (successfulStorage) {
      console.log("Login successful");
      return true;
    } else {
      console.log("No Token!");
      return false;
    }
  };

  const handleRegisterButtonPress = () => {
    console.log("HandleRegisterButtonPress Called!");
    navigation.navigate("RegisterUser");
  };

  const handleLoginButtonPress = async (emailAddress, password) => {
    try {
      // Attempt to authenticate the user with the provided credentials
      const authenticationResult = await handleLoginAttempt(
        emailAddress,
        password
      );

      // If authentication is successful, navigate the user to the appropriate screen based on their role
      if (authenticationResult) {
        const token = authenticationResult.token;
        authenticateUser(token);

        // Check the user's role and navigate accordingly
        switch (authenticationResult.user.currentRole) {
          case "manager":
            navigation.navigate("Home");
            break;
          case "player":
            navigation.navigate("PlayerHome");
            break;
          default:
            console.error(
              "User's current role is unrecognized:",
              authenticationResult.user.currentRole
            );
            break;
        }
      } else {
        // If authentication fails, log an error message
        console.error(
          "Authentication failed: Invalid email address or password."
        );
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error(
        "An unexpected error occurred while processing the login request:",
        error
      );
    }
  };

  const handleResetPasswordButtonPress = () => {
    console.log("RestPassword Button Pressed!");
    navigation.navigate("ResetPasswordScreen");
  };

  return (
    <View style={Styles.welcomeScreenContainer}>
      <View style={Styles.welcomeScreenLogoContainer}>
        <Image
          source={require("../../assets/free_agent_logo_trasparent_fulltext.png")}
          style={{
            width: "90%",
            resizeMode: "contain",
          }}
        />
      </View>
      <View style={Styles.welcomeScreenInputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#005F66"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>

      <View style={Styles.welcomeScreenInputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#005F66"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity onPress={() => handleResetPasswordButtonPress()}>
        <Text style={Styles.forgotButton}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleLoginButtonPress(emailAddress, password)}
      >
        <View style={Styles.welcomeButtonContainer}>
          <Text style={Styles.welcomeButton}>Log in</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={Styles.welcomeButtonContainer}>
          <Text
            style={Styles.welcomeButton}
            onPress={handleRegisterButtonPress}
          >
            Register
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default WelcomeScreen;
