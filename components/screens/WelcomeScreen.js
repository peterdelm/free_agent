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

function WelcomeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [result, setResult] = useState([]);

  //Remove this into a config file vvv
  // const url = "http://192.168.0.11:3001/api/users";
  const url = "http://192.168.2.42:3001/api/users";

  // if (!token) {
  //   return <Login setToken={setToken} />;
  // }
  // Login.propTypes = {
  //   setToken: PropTypes.func.isRequired,
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await sendLoginRequest({
      email,
      password,
    });
    setToken(token);
  };

  const sendLoginRequest = (credentials) => {
    console.log("handleLoginRequest called");

    // const url = "http://192.168.0.11:3001/api/users";
    const url = "http://192.168.2.42:3001/api/users/id";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => setResult(res));
  };

  const handleSuccessfulLogin = () => {
    navigation.navigate("Home");
  };

  const handleLoginAttempt = (email, password) => {
    credentials = { email, password };
    console.log("handleLoginAttempt called");
    console.log(credentials);
    loginRequestResult = sendLoginRequest(credentials);
    setToken(result.token);
    if (token) {
      handleSuccessfulLogin();
    } else {
      console.log("No Token!");
    }
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
            onChangeText={(email) => setEmail(email)}
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
            onPress={() => handleLoginAttempt(email, password)}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={Styles.registerButton}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default WelcomeScreen;
