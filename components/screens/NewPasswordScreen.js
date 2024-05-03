import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config";
import { useRoute } from "@react-navigation/native";

function NewPasswordScreen({ navigation }) {
  const route = useRoute();
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = route.params;

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleResetAttempt = async (newPassword) => {
    setLoading(true);
    try {
      const url = `${EXPO_PUBLIC_BASE_URL}api/users/reset`;
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
        setResponseMessage(data.message);

        // Navigate to the login screen after a successful password reset
        navigation.navigate("WelcomeScreen", { message: data.message });
      } else if (response.status === 401) {
        setError("Invalid credentials");
      } else {
        setError(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      setError(`Error during password reset: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetButtonPress = async () => {
    setError(null);
    setResponseMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (
      newPassword.length < 7 ||
      !/\d/.test(newPassword) ||
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword)
    ) {
      setError(
        "Password must be at least 7 characters long and contain at least one number and one symbol."
      );
      return;
    }

    try {
      setLoading(true);
      await handleResetAttempt(newPassword);
    } catch {
      console.log("ERROR in handleResetButtonPress");
    } finally {
      setLoading(false);
    }

    setConfirmPassword("");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setConfirmPassword("");
    });

    return unsubscribe;
  }, [navigation]);

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
          secureTextEntry
        />
      </View>
      <View style={Styles.welcomeScreenInputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Confirm New Password"
          placeholderTextColor="#005F66"
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          secureTextEntry
        />
      </View>

      {error && <Text style={Styles.errorText}>{error}</Text>}
      {responseMessage !== "" && (
        <Text style={Styles.responseMessage}>{responseMessage}</Text>
      )}
      <TouchableOpacity
        onPress={() => handleResetButtonPress()}
        disabled={loading}
      >
        <View style={Styles.welcomeButtonContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={Styles.welcomeButton}>Reset Password</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default NewPasswordScreen;
