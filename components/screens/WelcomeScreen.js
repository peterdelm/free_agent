import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

function WelcomeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    const url = `${EXPO_PUBLIC_BASE_URL}api/users/id`;

    const credentials = { emailAddress, password };
    console.log("handleLoginAttempt called to URL " + url);
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
        return { error: "Invalid credentials" }; // Return error message
      } else {
        console.log("Unexpected response:", response.status);
      }
    } catch (error) {
      console.log("Error during login attempt:", error);
      return { error: "An unexpected error occurred" }; // Return generic error message
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
    console.log("handleLoginButtonPress called");
    const result = await handleLoginAttempt(emailAddress, password);
    if (result && result.token) {
      const token = result.token;
      authenticateUser(token);
      if (result.user.currentRole === "manager") {
        navigation.navigate("Home");
      } else if (result.user.currentRole === "player") {
        navigation.navigate("PlayerHome");
      } else {
        console.log("ERROR: Result.user.current role is likely missing");
      }
    } else {
      console.log("Login failed:", result.error);
      setErrorMessage(result.error || "An unexpected error occurred");
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
      {errorMessage ? (
        <Text style={[Styles.errorText, { marginTop: 0 }]}>{errorMessage}</Text>
      ) : null}
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
