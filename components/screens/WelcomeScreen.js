import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Styles from "./Styles";
import { useAuth } from "../../contexts/authContext";

function WelcomeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const [isSecure, setIsSecure] = useState(true);

  const togglePasswordVisibility = () => {
    setIsSecure(!isSecure);
  };

  const handleLoginButtonPress = async (emailAddress, password) => {
    try {
      const user = await login(emailAddress, password);

      if (user) {
        console.log("User is", user);

        if (user.currentRole === "manager") {
          console.log("user.currentRole === manager");

          navigation.navigate("ManagerHome");
        } else if (user.currentRole === "player") {
          console.log("user.currentRole === player");

          navigation.navigate("PlayerHome");
        } else {
          setErrorMessage("Unknown user role");
          console.log("ERROR: Unknown user role");
        }
      } else {
        setErrorMessage("Login credentials are incorrect or missing");
        console.log("ERROR: Login credentials are incorrect or missing");
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred");
      console.log("ERROR:", error.message || "An unexpected error occurred");
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
      <View
        style={[
          Styles.welcomeScreenInputView,
          { flexDirection: "row", justifyContent: "flex-start" },
        ]}
      >
        <TextInput
          style={[
            Styles.TextInput,
            {
              height: 40,
            },
          ]}
          placeholder="Email"
          placeholderTextColor="#005F66"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>
      <View style={[Styles.welcomeScreenInputView, { flexDirection: "row" }]}>
        <TextInput
          style={[
            Styles.TextInput,
            {
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 5,
              height: 40,
            },
          ]}
          placeholder="Password"
          placeholderTextColor="#005F66"
          secureTextEntry={isSecure ? true : false}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Image
            source={
              isSecure
                ? require("../../assets/eye-slash-regular.png")
                : require("../../assets/eye-regular.png")
            }
            style={{
              width: 20,
              height: 20,
              resizeMode: "contain",
              marginRight: 5,
            }}
          />
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  welcomeScreenInputView: {
    // flexDirection: "row",
    // alignItems: "center",
    // borderColor: "#005F66", // Example border color
    // borderRadius: 5, // Add a border radius if needed
    // overflow: "hidden", // Ensure no overflow
    // padding: 5, // Add padding to container for spacing
  },
  TextInput: {
    // Add your styles here
  },
});

export default WelcomeScreen;
