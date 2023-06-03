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

function WelcomeScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
          {/*  <Text style={Styles.loginButton}>LOGIN</Text>*/}
          <Button title="LOGIN" onPress={() => navigation.navigate("Home")} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={Styles.registerButton}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default WelcomeScreen;
