import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Styles from "./Styles";
import { useAuth } from "../../contexts/authContext";

function WelcomeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  const handleLoginButtonPress = async (emailAddress, password) => {
    try {
      const user = await login(emailAddress, password);
      console.log("User is, ", user);
      if (user) {
        console.log("User exists");
        if (user.currentRole === "manager") {
          navigation.navigate("ManagerHome");
        } else if (user.currentRole === "player") {
          navigation.navigate("PlayerHome");
        }
      } else {
        setErrorMessage("Login credentials are incorrect or missing");
        console.log("ERROR: User role is missing or unrecognized");
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred");
    }
  };

  const handleRegisterButtonPress = () => {
    navigation.navigate("RegisterUser");
  };

  const handleResetPasswordButtonPress = () => {
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
      <TouchableOpacity onPress={handleResetPasswordButtonPress}>
        <Text style={Styles.forgotButton}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleLoginButtonPress(emailAddress, password)}
      >
        <View style={Styles.welcomeButtonContainer}>
          <Text style={Styles.welcomeButton}>Log in</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegisterButtonPress}>
        <View style={Styles.welcomeButtonContainer}>
          <Text style={Styles.welcomeButton}>Register</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default WelcomeScreen;
