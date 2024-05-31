import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter";
import getCurrentUser from "./getCurrentUser.helper";
import formatDate from "./formatDate";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import MapComponent from "./MapComponent.js";
import ColorToggleButton from "./ColorToggleButton.js";

function PlayerHome({ navigation }) {
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

  captureSelectedLocation = (selectedInput) => {
    console.log("Selected Location input: " + selectedInput);
    setGameAddress(selectedInput);
  };

  const route = useRoute();
  const successMessage = route.params || {};

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
      const url = `${EXPO_PUBLIC_BASE_URL}api/games/invites`;
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
            .then((res) => setActiveGames(res.availableGames))
            .then(console.log("Active games are: ", activeGames))
            // .then((res) => setActiveGames(res.activeGames))
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

  useEffect(() => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/games/invites`;

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
          .then((res) => setActiveGames(res.availableGames))
          .then(console.log("Active games are: ", activeGames))
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
    <View style={Styles.playerHomeContainer}>
      <View style={Styles.screenHeader}>
        <Image
          resizeMode="cover"
          source={require("../../assets/prayingHands.png")}
          style={{ width: 50, height: 50, resizeMode: "contain" }}
        />
        <Text style={{ fontSize: 35, padding: 20 }}>Player Home</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",

            flex: 1,
          }}
        >
          {currentUser && <ColorToggleButton user={currentUser} />}
        </View>
      </View>
      <View style={Styles.playerHomeContentContainer}>
        {activeGames && activeGames.length > 0 ? (
          <MapComponent activeGames={activeGames} navigation={navigation} />
        ) : (
          <MapComponent activeGames={[]} />
        )}
        <View style={Styles.playerHomeTextContentContainer}>
          <View style={Styles.playerHomeAvailableGamesContainer}>
            <View style={[Styles.playerHomeAvailableGamesHeader]}>
              <Text style={{ fontSize: 20 }}>Available Games</Text>
            </View>
            <View style={Styles.availableGamesScroller}>
              <ScrollView>
                {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
              </ScrollView>
            </View>
          </View>
          {/* 
          <View style={Styles.goOfflineButtonContainer}>
            <TouchableOpacity
              onPress={() => console.log("goOffline Button Pressed")}
            >
              <View style={Styles.goOfflineButton}>
                <Image
                  source={require("../../assets/chevron-right-solid.png")}
                  style={Styles.goOfflineButtonImage}
                />
                <Text style={Styles.goOfflineButtonText}>Go Offline</Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
}

export default PlayerHome;
