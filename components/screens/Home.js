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
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Styles from "./Styles";
import { useRoute } from "@react-navigation/native";

function HomeScreen({ navigation, message }) {
  const [activeGames, setActiveGames] = useState([]);

  const route = useRoute();
  const successMessage = route.params || {};

  console.log("message is...");
  console.log(message);

  console.log("route.params is...");
  console.log(route.params);

  console.log("Success message is...");
  console.log(successMessage["successMessage"]);

  useEffect(() => {
    const url = "http://192.168.0.11:3001/api/games/active";
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => setActiveGames(res));
  }, []);

  const allActiveGames = activeGames.map((game, index) => (
    <Text key={index} style={Styles.activeGames}>
      {game.location} @ {game.time}
    </Text>
  ));
  const noActiveGames = <Text>No Games yet. Why not</Text>;

  function Banner({ message }) {
    const result = message["successMessage"] || "";
    const isMessageEmpty = result === "";

    if (isMessageEmpty) {
      return null; // Don't render anything if the message is empty
    }

    //set a timer
    //do a slide animationr
    //highlight the new game for a few seconds
    return (
      <View>
        <Text style={Styles.primaryButton}>{result}</Text>
      </View>
    );
  }

  return (
    <View style={Styles.container}>
      {<Banner message={successMessage} />}
      <View style={Styles.homeContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("CreateGame")}>
          <Text style={Styles.primaryButton}>Find a Goalie</Text>
        </TouchableOpacity>
        {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
      </View>
    </View>
  );
}

export default HomeScreen;
