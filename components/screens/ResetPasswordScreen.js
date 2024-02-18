import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config";

function ResetPasswordScreen({ navigation }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [token, setToken] = useState("");

  const handleResetAttempt = async (emailAddress) => {
    const credentials = { emailAddress };
    console.log("handleLoginAttempt called");
    console.log(credentials);
    const url = `${EXPO_PUBLIC_BASE_URL}api/users/reset`;

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
        console.log("Invalid credentials");
      } else {
        console.log("Unexpected response:", response.status);
      }
    } catch (error) {
      console.log("Error during login attempt:", error);
    }
  };

  const handleResetButtonPress = async () => {
    try {
      console.log("Reset Button Pressed");
      const result = await handleResetAttempt(emailAddress);
      if (result) {
        console.log(result.message);
      }
    } catch {
      console.log("ERROR in handleResetButtonPress");
    }
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

      <TouchableOpacity onPress={() => handleResetButtonPress()}>
        <View style={Styles.welcomeButtonContainer}>
          <Text style={Styles.welcomeButton}>Reset Password</Text>
        </View>
      </TouchableOpacity>
    </View>
    // </ImageBackground>
  );
}

export default ResetPasswordScreen;
