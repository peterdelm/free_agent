import { StatusBar } from "expo-status-bar";
import {
  Button,
  ImageBackground,
  Stylesheet,
  Text,
  View,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Styles from "./Styles";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

function WelcomeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [token, setToken] = useState("");
  const [result, setResult] = useState([]);

  //Remove this into a config file vvv
  const url = process.env.EXPO_PUBLIC_BASE_URL + "api/users";

  const storeSessionToken = async (token) => {
    try {
      await AsyncStorage.setItem("@session_token", token);
      console.log("Session token stored successfully.");
    } catch (error) {
      console.log("Error storing session token:", error);
    }
  };

  // Get the token from AsyncStorage
  const getTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem("session_token");
      return token;
    } catch (error) {
      console.log("Error retrieving token from AsyncStorage:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await sendLoginRequest({
      emailAddress,
      password,
    });
    setToken(token);
  };

  const sendLoginRequest = async (credentials) => {
    console.log("handleLoginRequest called");

    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/users/id";
    console.log(url);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        console.log(res.status);

        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.log("Error in sendLoginRequest:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  };

  const handleSuccessfulLogin = () => {
    navigation.navigate("Home");
  };

  const handleLoginAttempt = async (emailAddress, password) => {
    credentials = { emailAddress, password };
    console.log("handleLoginAttempt called");
    console.log(credentials);
    try {
      const result = await sendLoginRequest(credentials);
      console.log(result.token);
      setToken(result.token);
      if (result.token) {
        await storeSessionToken(result.token);
        handleSuccessfulLogin();
      } else {
        console.log("No Token!");
      }
    } catch (error) {
      console.log("Error during login attempt:", error);
      // Handle the error here, e.g., show an error message to the user
    }
  };

  const handleRegisterButtonPress = () => {
    console.log("HandleRegisterButtonPress Called!");
    navigation.navigate("RegisterUser");
  };

  return (
    <ImageBackground
      style={Styles.background}
      source={require("../../assets/background.jpg")}
    >
      <View style={Styles.container}>
        <View style={Styles.inputView}>
          <TextInput
            style={Styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#005F66"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>

        <View style={Styles.inputView}>
          <TextInput
            style={Styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#005F66"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity>
          <Text style={Styles.forgotButton}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Button
            title="LOGIN"
            onPress={() => handleLoginAttempt(emailAddress, password)}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={Styles.registerButton}
            onPress={handleRegisterButtonPress}
          >
            REGISTER
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default WelcomeScreen;
