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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Styles from "./Styles";
import Picker from "./Picker";

const CreateGame = ({ navigation }) => {
  const [gender, setGender] = useState("");
  const [calibre, setCalibre] = useState("");
  const [game_type, setGameType] = useState("");
  const [location, setGameAddress] = useState("");
  const [date, setGameDate] = useState("");
  const [time, setGameTime] = useState("");
  const [game_length, setGameLength] = useState("");
  const [team_name, setTeamName] = useState("");
  const [additional_info, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState("");
  const [sportSpecificValues, setSportSpecificValues] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState();

  // const url = "http://localhost:3001/games";
  // const url = "http://192.168.2.42:3001/api/games";
  const url = "http://192.168.0.11:3001/api/games";

  // const url = process.env.REACT_APP_BASE_URL;

  //Retrieve the relevant values for the selected sport
  useEffect(() => {
    const url = "http://192.168.0.11:3001/api/sports";
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => setSportSpecificValues(res));
  }, []);

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validateInputs = () => {
    if (!calibre) {
      console.log("No Calibre");
      handleError("Please input calibre", "calibre");
    }
  };

  const onSubmit = (event) => {
    validateInputs();
    const body = {
      gender,
      calibre,
      game_type,
      date,
      location,
      time,
      game_length,
      team_name,
      additional_info,
      is_active: true,
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
      .catch((error) => console.log(error));
  };

  const allPositions = sportSpecificValues.map((course, index) => (
    <option value={course.id}>{course.position}</option>
  ));

  return (
    <View style={Styles.container}>
      <Text>Who are you looking for?</Text>
      <View>
        <Picker />
      </View>
      <View style={Styles.inputView}>
        <Picker
          style={Styles.TextInput}
          placeholder="Calibre"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(calibre) => setCalibre(calibre)}
        />
      </View>
      <View></View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Game Type"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(game_type) => setGameType(game_type)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Gender"
          defaultValue=""
          placeholderText
          Color="#005F66"
          onChangeText={(gender) => setGender(gender)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Location"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(location) => setGameAddress(location)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Date"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(date) => setGameDate(date)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Time"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(time) => setGameTime(time)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Game Length (minutes)"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(game_length) => setGameLength(game_length)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Additional Info"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(additional_info) => setAdditionalInfo(additional_info)}
        />
      </View>
      <View>
        <TouchableOpacity>
          <Button title="CREATE GAME" onPress={() => onSubmit()} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateGame;
