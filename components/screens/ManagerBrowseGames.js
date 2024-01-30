import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";
import getCurrentUser from "./getCurrentUser.helper";
import { useFocusEffect } from "@react-navigation/native";

const ManagerBrowseGames = ({ navigation }) => {
  const [activeGames, setActiveGames] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      };
      fetchCurrentUser();
    }, [])
  );

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
    <View style={Styles.managerBrowseGamesContainer}>
      <View
        style={[
          Styles.screenContainer,
          { borderBottomColor: "black", borderBottomWidth: 2 },
        ]}
      >
        <View style={Styles.screenHeader}>
          <Image
            source={require("../../assets/volleyball-solid.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text
            style={{
              fontSize: 35,
              padding: 20,
            }}
          >
            Games
          </Text>
        </View>
      </View>
      <View style={Styles.managerBrowseGamesContentContainer}>
        <View style={Styles.managerBrowseGamesContainerHeader}>
          <Text style={{ fontSize: 30 }}>Upcoming Games</Text>
        </View>
        <View style={Styles.pendingGamesContainer}>
          <ScrollView>
            {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
          </ScrollView>
        </View>
        <View style={Styles.managerBrowseGamesContainerHeader}>
          <Text style={{ fontSize: 30 }}>Previous Games</Text>
        </View>
        <View style={[Styles.pendingGamesContainer, { marginBottom: 12 }]}>
          <ScrollView>
            {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
          </ScrollView>
        </View>
      </View>

      <NavigationFooter
        currentRole={currentUser.currentRole}
        navigation={navigation}
      >
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default ManagerBrowseGames;
