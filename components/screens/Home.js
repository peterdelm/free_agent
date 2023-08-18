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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";

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

  // // Get the token from AsyncStorage
  // const getTokenFromStorage = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("session_token").then(
  //       console.log("AsyncStorage.getItem Called")
  //     );

  //     return token;
  //   } catch (error) {
  //     console.log("Error retrieving token from AsyncStorage:", error);
  //     return null;
  //   }
  // };

  // const makeAuthenticatedRequest = async (url, method = "GET", body = null) => {
  //   console.log("makeAuthenticatedRequest");

  //   try {
  //     const token = await getTokenFromStorage();

  //     if (!token) {
  //       // Handle token not found (e.g., redirect to login page)
  //       return;
  //     }

  //     const headers = {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     };

  //     const requestOptions = {
  //       method,
  //       headers,
  //       body: body ? JSON.stringify(body) : null,
  //     };

  //     const response = await fetch(url, requestOptions);
  //     const data = await response.json();

  //     // Handle the API response as needed
  //     // ...
  //     console.log(data);

  //     return data;
  //   } catch (error) {
  //     console.log("Error making authenticated request:", error);
  //     // Handle error
  //   }
  // };

  // Get the token from AsyncStorage
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
    const url = process.env.EXPO_APP_BASE_URL + "api/games/active";

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
              return res.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((res) => setActiveGames(res));
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
    // const url = "http://192.168.2.42:3001/api/games/active";
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
