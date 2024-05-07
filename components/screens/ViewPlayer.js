import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

function ViewPlayer({ navigation, message }) {
  const route = useRoute();
  const { playerId } = route.params;
  const [player, setPlayer] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("PlayerId is " + playerId);
  console.log("Player is " + player);

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
    const fetchData = async () => {
      try {
        const token = await getTokenFromStorage();
        const url = `${EXPO_PUBLIC_BASE_URL}api/players/${playerId}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const requestOptions = {
          headers,
        };

        const res = await fetch(url, requestOptions);
        if (res.ok) {
          const playerData = await res.json();
          setPlayer(playerData);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.log("Error fetching player data:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [playerId]);

  const handleDeletePlayerButtonPress = async () => {
    try {
      const token = await getTokenFromStorage();
      const url = `${EXPO_PUBLIC_BASE_URL}api/players/${playerId}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestOptions = {
        method: "DELETE",
        headers,
      };

      const res = await fetch(url, requestOptions);
      if (res.ok) {
        console.log("Player deleted successfully.");
        navigation.navigate("ManagePlayers", { refresh: true });
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.log("Error deleting player:", error);
      // Handle error
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={Styles.container}>
      <Text style={Styles.primaryButton}>PLAYER PROFILE</Text>
      <Text>Sport: {player.sport}</Text>
      <Text>Calibre: {player.calibre}</Text>
      <Text>Location: {player.location}</Text>
      <Text>Travel Range: {player.travelRange}</Text>
      <Text>Bio: {player.bio}</Text>
      <Text>Position: {player.position}</Text>
      <Text>{player.gender}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditPlayer", {
            playerId: player.id,
            playerSport: player.sport,
          })
        }
      >
        <Text style={Styles.primaryButton}>Edit Player</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeletePlayerButtonPress()}>
        <Text style={Styles.primaryButton}>Delete Player</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ViewPlayer;
