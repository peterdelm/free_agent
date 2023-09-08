import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";

function ViewPlayer({ navigation, message }) {
  const route = useRoute();
  const { playerId } = route.params;
  const [player, setPlayer] = useState([]);
  console.log("PlayerId is " + playerId);
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
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/players/" + playerId;

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
          .then((res) => setPlayer(res));
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  return (
    <View style={Styles.container}>
      <Text style={Styles.primaryButton}>THIS IS THE PLAYER SCREEN</Text>
      <Text style={Styles.primaryButton}>{player.calibre}</Text>
      <Text style={Styles.primaryButton}>{player.gender}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("EditPlayer", { playerId: game.id })}
      >
        <Text style={Styles.primaryButton}>Edit Player</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ViewPlayer;
