import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter";
import getCurrentUser from "./getCurrentUser.helper";

import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

const ManagePlayers = ({ navigation }) => {
  const [activeGames, setActiveGames] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [refreshPlayers, setRefreshPlayers] = useState(false);
  const route = useRoute();
  const { refresh } = route.params || {};

  useEffect(() => {
    if (refresh) {
      setRefreshPlayers(true);
    }
  }, [refresh]);

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
      const fetchUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      const user = fetchUser();
      console.log(user.currentRole);
    }, [refreshPlayers])
  );

  useEffect(() => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/players/playerRoster`;

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
          .then((res) => setActiveGames(res.players))
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
  }, [refreshPlayers]);

  let allActiveGames = []; // Initialize as null initially
  const noActiveGames = <Text>No Players yet. Why not</Text>;

  if (activeGames.length > 0) {
    allActiveGames = activeGames.map((game, index) => (
      <TouchableOpacity
        key={game.id}
        onPress={() => navigation.navigate("ViewPlayer", { playerId: game.id })}
      >
        <Text key={index} style={Styles.activeGames}>
          {game.sport} Profile
        </Text>
      </TouchableOpacity>
    ));
  }
  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          flex: 0,
        }}
      >
        <View style={Styles.screenHeader}>
          <Text style={{ fontSize: 35, padding: 20 }}>
            Manage Player Screen
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "96%",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate("CreatePlayer")}>
          <Text
            style={[
              Styles.input,
              (style = {
                fontSize: 20,
                textAlign: "center",
                textAlignVertical: "center",
                lineHeight: Platform.select({
                  ios: 50,
                }),
                margin: 20,
              }),
            ]}
          >
            Create a new player profile
          </Text>
        </TouchableOpacity>
      </View>

      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default ManagePlayers;
