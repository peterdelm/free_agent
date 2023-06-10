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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Styles from "./Styles";

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

  // const url = "http://localhost:3001/games";
  const url = "http://192.168.0.7:3001/api/games";

  // if (
  //   gender.length == 0 ||
  //   calibre.length == 0 ||
  //   gameType.length == 0 ||
  //   gameDate.length == 0 ||
  //   gameAddress.length == 0 ||
  //   gameTime.length == 0 ||
  //   gameLength.length == 0 ||
  //   teamName.length == 0 ||
  //   additionalInfo.length == 0
  // )
  //   return;
  const onSubmit = (event) => {
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

  return (
    <View style={Styles.container}>
      <Text>This is the Create Game screen</Text>

      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Calibre"
          placeholderTextColor="#005F66"
          onChangeText={(calibre) => setCalibre(calibre)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Game Type"
          placeholderTextColor="#005F66"
          onChangeText={(game_type) => setGameType(game_type)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Gender"
          placeholderTextColor="#005F66"
          onChangeText={(gender) => setGender(gender)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Location"
          placeholderTextColor="#005F66"
          onChangeText={(location) => setGameAddress(location)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Date"
          placeholderTextColor="#005F66"
          onChangeText={(date) => setGameDate(date)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Time"
          placeholderTextColor="#005F66"
          onChangeText={(time) => setGameTime(time)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Game Length (minutes)"
          placeholderTextColor="#005F66"
          onChangeText={(game_length) => setGameLength(game_length)}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder="Additional Info"
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
