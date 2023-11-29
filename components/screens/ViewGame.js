import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

function ViewGame({ navigation, message }) {
  const route = useRoute();
  const { gameId } = route.params;
  const [game, setGame] = useState([]);
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
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games/" + gameId;

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
          .then((res) => setGame(res));
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  return (
    <View style={Styles.container}>
      <Text style={Styles.primaryButton}>{game.location}</Text>
      <Text style={Styles.primaryButton}>
        {game.date} @ {game.time}
      </Text>
      <Text style={Styles.primaryButton}>{game.position}</Text>
      <Text style={Styles.primaryButton}>{game.calibre}</Text>
      <Text style={Styles.primaryButton}>Gender: {game.gender}</Text>
      <Text style={Styles.primaryButton}>{game.game_type}</Text>
      <Text style={Styles.primaryButton}>{game.game_length} Minutes</Text>
    </View>
  );
}

export default ViewGame;
