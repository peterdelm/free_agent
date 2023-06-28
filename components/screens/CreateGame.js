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
  const [sportSpecificValues, setSportSpecificValues] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [calibreList, setCalibreList] = useState([""]);
  const [gameTypeList, setGameTypeList] = useState([""]);
  const [genderList, setGenderList] = useState([""]);
  const [gameLengthList, setGameLengthList] = useState([""]);

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
      .then((res) => {
        setSportSpecificValues(res);
        console.log(sportSpecificValues[0]);

        setCalibreList(res[0].calibre);
        console.log(res[0]);

        setGameTypeList(res[0].game_type);
        setGenderList(res[0].gender);
        setGameLengthList(res[0].game_length);

        // console.log(res[0]);
      });
    // .then((res) => setSportSpecificValues(res));
  }, []);

  // const handleError = (errror, input) => {
  //   setErrors((prevState) => ({ ...prevState, [input]: error }));
  // };

  const validateInputs = () => {
    if (!calibre) {
      console.log("No Calibre");
      // handleError("Please input calibre", "calibre");
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

  var calibres = calibreList;
  var gameTypes = gameTypeList;
  var genders = genderList;
  var gameLengths = gameLengthList;
  console.log(gameLengths);

  return (
    <View style={Styles.container}>
      <View style={Styles.inputView}>
        <Picker
          style={Styles.TextInput}
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(calibre) => setCalibre(calibre)}
          language={calibres}
          label="Calibre"
        />
      </View>
      <View></View>
      <View style={Styles.inputView}>
        <Picker
          style={Styles.TextInput}
          placeholder="Game Type"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(game_type) => setGameType(game_type)}
          language={gameTypes}
          label="Game Type"
        />
      </View>
      <View style={Styles.inputView}>
        <Picker
          style={Styles.TextInput}
          defaultValue=""
          placeholderText
          Color="#005F66"
          onChangeText={(gender) => setGender(gender)}
          language={genders}
          label="Gender"
        />
      </View>
      <View style={Styles.inputView}>
        {/* This will be a LOCATION SELECTOR */}
        <TextInput
          style={Styles.TextInput}
          placeholder="Location"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(location) => setGameAddress(location)}
          language={gameTypes}
          label="Location"
        />
      </View>
      <View style={Styles.inputView}>
        {/* This will be a DATE SELECTOR */}
        <TextInput
          style={Styles.TextInput}
          placeholder="Date"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(date) => setGameDate(date)}
          language={gameTypes}
          label="Date"
        />
      </View>
      <View style={Styles.inputView}>
        {/* This will be a TIME SELECTOR */}
        <TextInput
          style={Styles.TextInput}
          placeholder="Time"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(time) => setGameTime(time)}
          label="Time"
        />
      </View>
      <View style={Styles.inputView}>
        <Picker
          style={Styles.TextInput}
          placeholder="Game Length (minutes)"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(game_length) => setGameLength(game_length)}
          language={gameLengths}
          label="Game Length"
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
