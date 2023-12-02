import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function HomeScreen({ navigation, message }) {
  const [activeGames, setActiveGames] = useState([]);

  const route = useRoute();
  const successMessage = route.params || {};
  console.log("Success message is...");
  console.log(successMessage["successMessage"]);

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

  useFocusEffect(
    React.useCallback(() => {
      const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games/active";
      console.log("UsefocusEffect Fetch games called");

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
    }, [])
  );

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
  function Banner({ message }) {
    const result = message["successMessage"] || "";
    const isMessageEmpty = result === "";

    if (isMessageEmpty) {
      return null; // Don't render anything if the message is empty
    }

    //set a timer
    //do a slide animation
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
          <Text style={Styles.primaryButton}>Find a Player</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ManagePlayers")}>
          <Text style={Styles.primaryButton}>Manage Your Player Profiles</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("PlayerInbox")}>
          <Text style={Styles.primaryButton}>Player Inbox</Text>
        </TouchableOpacity>
        <Text>Upcoming Games:</Text>

        <ScrollView>
          {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
        </ScrollView>
      </View>
    </View>
  );
}

export default HomeScreen;
