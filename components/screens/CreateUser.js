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
import React, { useEffect, useState, useRef, Component } from "react";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateUser = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const url = process.env.EXPO_PUBLIC_BASE_URL + "api/users";

  const storeSessionToken = async (token) => {
    try {
      await AsyncStorage.setItem("@session_token", token);
      console.log("Session token stored successfully.");
      return true;
    } catch (error) {
      console.log("Error storing session token:", error);
      return false;
    }
  };

  const handleFormSubmit = () => {
    onSubmit();
    //if onSubmit returns successfully:
    //return to HomeScreen
    //Display 'User Created, Welcome' notification
  };

  // const handleError = (errror, input) => {
  //   setErrors((prevState) => ({ ...prevState, [input]: error }));
  // };

  const validateInputs = () => {
    if (!emailAddress) {
      console.log(emailAddress);

      console.log("No Email Address!");
      // handleError("Please input calibre", "calibre");
    }
  };

  const onSubmit = async () => {
    try {
      validateInputs();

      const body = {
        firstName,
        lastName,
        emailAddress,
        password,
      };
      console.log(body);
      console.log("URL in onSubmit in CreateUser was " + url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      console.log("Submit successful");
      console.log("User created with token: " + data.token);

      const successfulStorage = await storeSessionToken(data.token);

      if (successfulStorage) {
        console.log("Storage was successful");
        navigation.navigate("Home", {
          successMessage: "User created successfully.",
        });
      }
    } catch (error) {
      console.error("Error making authenticated request:", error);
    }
  };

  const handleLoginButtonPress = () => {
    console.log("HandleRegisterButtonPress Called!");
    const loginSuccessful = handleFormSubmit();
    if (loginSuccessful) {
      navigation.navigate("Home");
    }
  };
  return (
    <View style={Styles.container}>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="First Name"
          placeholderTextColor="#005F66"
          onChangeText={(firstName) => setFirstName(firstName)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Last Name"
          placeholderTextColor="#005F66"
          onChangeText={(lastName) => setLastName(lastName)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Email..."
          placeholderTextColor="#005F66"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#005F66"
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <View>
        <TouchableOpacity>
          <Button
            title="REGISTER ACCOUNT"
            onPress={() => handleLoginButtonPress()}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateUser;
