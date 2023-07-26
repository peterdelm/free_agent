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

const CreateUser = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  // const url = "http://localhost:3001/games";
  // const url = "http://192.168.2.42:3001/api/games";
  const url = "http://192.168.0.7:3001/api/users";

  // const url = process.env.REACT_APP_BASE_URL;

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

  const onSubmit = () => {
    console.log(emailAddress);

    validateInputs();
    const body = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    console.log(body);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        if (data.success === true) {
          console.log("Submit successful");
          navigation.navigate("Home", {
            successMessage: "User created successfully.",
          });
        } else {
          console.log("Submit Failed");
        }
      })
      .catch((error) => console.log(error));
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
          <Button title="REGISTER ACCOUNT" onPress={() => handleFormSubmit()} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateUser;
