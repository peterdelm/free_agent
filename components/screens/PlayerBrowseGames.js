import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles.js";
import NavigationFooter from "./NavigationFooter.js";
import formatDate from "./formatDate.js";
import getCurrentUser from "./getCurrentUser.helper.js";
import { useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";
import { sportIconPath } from "../../utils/sportIcons.js";
import {
  timeFormatFromString,
  formattedLocation,
} from "../../utils/timeFormatFromString.js";
const PlayerBrowseGames = ({ navigation }) => {
  const [activeGames, setActiveGames] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Fetch current user
          const user = await getCurrentUser();
          setCurrentUser(user);
          const url = `${EXPO_PUBLIC_BASE_URL}api/games/acceptedplayerinvites`;
          const headers = {
            "Content-Type": "application/json",
            futureflag: "true",
          };
          const requestOptions = { headers };
          console.log("FocusEffect headers are", requestOptions);
          const response = await authFetch(url, requestOptions);
          if (response.status === 200 && response.body.availableGames) {
            setActiveGames(response.body.availableGames);
          } else {
            setError("Failed to load games.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("An error occurred while fetching the games.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/games/acceptedplayerinvites`;

    const fetchData = async () => {
      try {
        console.log("URL is " + url);

        const headers = {
          "Content-Type": "application/json",
          futureflag: "true",
        };

        const requestOptions = {
          headers,
        };

        console.log("UseEffect headers are", requestOptions);

        response = await authFetch(url, requestOptions);
        console
          .log("Response is ", response)
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
    allActiveGames = activeGames.map((game) => (
      <TouchableOpacity
        key={game.id}
        onPress={() =>
          navigation.navigate("ViewGame", {
            gameId: game.id,
            previousScreen: "PlayerBrowseGames",
          })
        }
      >
        <View style={[Styles.upcomingGameContainer]}>
          <View style={[Styles.upcomingGameDateContainer, { width: "22%" }]}>
            <Text>{formatDate(game.date)}</Text>
            <Text>{timeFormatFromString(game.time)}</Text>
          </View>
          <View style={Styles.upcomingGameAddressContainer}>
            <View style={{ flexDirection: "column", flex: 1, flexShrink: 1 }}>
              {game.locationName ? (
                <Text
                  style={{
                    flex: 1,
                    flexShrink: 1,
                  }}
                >
                  {game.locationName}
                </Text>
              ) : null}

              <Text
                style={{
                  flex: 1,
                  flexShrink: 1,
                }}
              >
                {formattedLocation(game.location)}
              </Text>
            </View>
            <View style={Styles.upcomingGameIconContainer}>
              {game.sport ? (
                <Image
                  source={sportIconPath(game.sport)}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: "contain",
                  }}
                />
              ) : null}
            </View>
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
          <Text style={{ fontSize: 30 }}>Games Joined</Text>
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

export default PlayerBrowseGames;
