import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter.js";
import formatDate from "./formatDate.js";
import getCurrentUser from "./getCurrentUser.helper.js";
import { useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";

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

  useEffect(() => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/games/acceptedplayerinvites`;

    const fetchData = async () => {
      try {
        console.log("URL is " + url);

        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          headers,
        };

        authFetch(url, requestOptions)
          .then((res) => {
            if (res.status === 200) {
              return res;
            } else throw new Error("Network response was not ok.");
          })
          .then((res) => setActiveGames(res.body.availableGames))
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

  let allActiveGames = []; // Initialize as empty array initially
  const noActiveGames = <Text>No Games yet. Why not?</Text>;

  if (activeGames.length > 0) {
    allActiveGames = activeGames.map(({ game }) => (
      <TouchableOpacity
        key={game.id}
        onPress={() => navigation.navigate("ViewGame", { gameId: game.id })}
      >
        <View style={Styles.upcomingGameContainer}>
          <View style={Styles.upcomingGameDateContainer}>
            <Text>{formatDate(game.date)}</Text>
          </View>
          <View style={Styles.upcomingGameAddressContainer}>
            <Text>{game.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }
  return (
    <View style={[Styles.managerBrowseGamesContainer]}>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          width: "100%",
        }}
      >
        <View
          style={[Styles.screenHeader, (style = { justifyContent: "center" })]}
        >
          <Image
            source={require("../../assets/volleyball-solid.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 35, padding: 20 }}>Player Games</Text>
        </View>
      </View>
      <View style={Styles.managerBrowseGamesContentContainer}>
        <View style={Styles.managerBrowseGamesContainerHeader}>
          <Text style={{ fontSize: 30 }}>Games</Text>
        </View>
        <View
          style={[Styles.pendingGamesContainer, (style = { marginBottom: 20 })]}
        >
          <ScrollView>
            {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
          </ScrollView>
        </View>
      </View>

      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default ManagerBrowseGames;
