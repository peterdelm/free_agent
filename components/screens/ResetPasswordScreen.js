import React, { useState } from "react";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import { EXPO_PUBLIC_BASE_URL } from "../../.config";

function ResetPasswordScreen({ navigation }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInputs = () => {
    if (!emailAddress || !validateEmail(emailAddress)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleResetAttempt = async () => {
    const credentials = { emailAddress };
    console.log("handleResetAttempt called");
    console.log(credentials);
    const url = `${EXPO_PUBLIC_BASE_URL}api/users/reset`;

    try {
      if (!validateInputs()) {
        return;
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 200) {
        const data = await response.json();
        navigation.navigate("WelcomeScreen", {
          message:
            "A link to change your password has been sent to your email. Please be sure to check your junk folder.",
        });
      } else if (response.status === 401) {
        console.log("Invalid credentials");
      } else {
        console.log("Unexpected response:", response.status);
      }
    } catch (error) {
      console.log("Error during password reset attempt:", error);
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
      {errorMessage && <Text style={Styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity onPress={handleResetAttempt}>
        <View style={Styles.welcomeButtonContainer}>
          <Text style={Styles.welcomeButton}>Reset Password</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default ResetPasswordScreen;
