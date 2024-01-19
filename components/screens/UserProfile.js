import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect, useFocusEffect } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";

const UserProfile = ({ navigation }) => {
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
  const noActiveGames = <Text>No Games yet. Why not?</Text>;

  if (activeGames.length > 0) {
    allActiveGames = activeGames.map((game, index) => (
      <TouchableOpacity
        key={game.id}
        onPress={() => navigation.navigate("ViewGame", { gameId: game.id })}
      >
        <View key={index} style={Styles.upcomingGameContainer}>
          <View style={Styles.upcomingGameDateContainer}>
            <Text key={index}>{formatDate(game.date)}</Text>
          </View>
          <View style={Styles.upcomingGameAddressContainer}>
            <Text key={index}>{game.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }
  return (
    //Show Profile
    //Personal info
    //Login/Security
    //Settings
    //Switch to player
    //Referrals
    //Help
    //How it works
    //Terms of Service
    <View style={Styles.managerBrowseGamesContainer}>
      <View style={Styles.screenContainer}>
        <View
          style={[
            Styles.screenContainer,
            { borderBottomColor: "black", borderBottomWidth: 2 },
          ]}
        >
          <View style={Styles.screenHeader}>
            <Image
              source={require("../../assets/user-solid.png")}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
            <Text
              style={{
                fontSize: 35,
                padding: 20,
              }}
            >
              Profile
            </Text>
          </View>
        </View>
        <View style={Styles.screenContainer}>
          <View style={Styles.screenHeader}>
            <Text style={{ fontSize: 30, paddingTop: 20 }}>Upcoming Games</Text>
          </View>
        </View>
      </View>

      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default UserProfile;
