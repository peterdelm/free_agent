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
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Styles from "./Styles";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import react from "react";

const ManagePlayers = ({ navigation }) => {
  const [activeGames, setActiveGames] = useState([]);

  const getTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem("@session_token");
      console.log("Token is " + token);
      return token;
    } catch (error) {
      console.log("Error retrieving token from AsyncStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games/active";

    const fetchData = async () => {
      try {
        const token = await getTokenFromStorage();
        console.log("Token is " + token);
        console.log("URL is " + url);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const requestOptions = {
          headers,
        };

        fetch(url, requestOptions)
          .then((res) => {
            if (res.ok) {
              console.log("res was ok");
              return res.json();
            } else throw new Error("Network response was not ok.");
          })
          .then((res) => setActiveGames(res.activeGames))
          .catch((error) => {
            console.log("Error during fetch:", error);
            // Handle specific error scenarios
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  let allActiveGames = []; // Initialize as null initially
  const noActiveGames = <Text>No Games yet. Why not</Text>;

  if (activeGames.length > 0) {
    allActiveGames = activeGames.map((game, index) => (
      <TouchableOpacity
        key={game.id}
        onPress={() => navigation.navigate("ViewGame", { gameId: game.id })}
      >
        <Text key={index} style={Styles.activeGames}>
          {game.location} @ {game.time}
        </Text>
      </TouchableOpacity>
    ));
  }
  return (
    <View style={Styles.container}>
      <View style={Styles.homeContainer}>
        <Text style={Styles.primaryButton}>Manage Player Screen</Text>
        <ScrollView>
          {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate("CreatePlayer")}>
        <Text style={Styles.primaryButton}>Create a new player profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManagePlayers;
