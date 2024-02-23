import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";

function NewPasswordScreen({ navigation }) {
  const route = useRoute();
  const { token } = route.params;

  useEffect(() => {
    console.log("Token received:", token);
  }, []);
  const [newPassword, setNewPassword] = useState("");

  const handleResetAttempt = async (newPassword) => {
    console.log("handleNewPassword called with password: " + newPassword);
    const url = `${EXPO_PUBLIC_BASE_URL}api/users/reset`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
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
      const result = await handleResetAttempt(newPassword);
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
          placeholder="New Password"
          placeholderTextColor="#005F66"
          onChangeText={(newPassword) => setNewPassword(newPassword)}
        />
      </View>

      <TouchableOpacity onPress={() => handleResetButtonPress()}>
        <View style={Styles.welcomeButtonContainer}>
          <Text style={Styles.welcomeButton}>Reset Password</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default NewPasswordScreen;
