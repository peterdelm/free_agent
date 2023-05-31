import { StatusBar } from "expo-status-bar";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import ValidatePassword from "./ValidatePassword";

function WelcomeScreen(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#005F66"
            onChangeText={(email) => setEmail(email)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#005F66"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotButton}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          {/*  <Text style={styles.loginButton}>LOGIN</Text>*/}
          <Button title="LOGIN" onPress={ValidatePassword(password)} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.registerButton}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A4D65E",
  },
  image: {
    width: 100,
    height: 100,
  },
  inputView: {
    backgroundColor: "white",
    borderRadius: 30,
    width: 250,
    height: 60,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  forgotButton: {
    height: 30,
    marginBottom: 30,
  },
  loginButton: {
    width: 250,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "#EB6FBD",
    textAlign: "center",
    textAlignVertical: "center",
  },
  registerButton: {
    width: 250,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "#EB6FBD",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default WelcomeScreen;
