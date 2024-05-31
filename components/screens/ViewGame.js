import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import NavigationFooter from "./NavigationFooter";
import getCurrentUser from "./getCurrentUser.helper";
import { useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

function ViewGame({ navigation, message }) {
  const [currentUser, setCurrentUser] = useState({});

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

  const getUserPlayers = (userId) => {};

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
    const url = `${EXPO_PUBLIC_BASE_URL}api/games/${gameId}`;
    console.log("Fetching game with id: " + gameId);

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
          .then((res) => setGame(res.game));
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = () => {
    onSubmit();
  };

  const handleQuitGameButtonPress = () => {
    console.log("handleQuitGameButtonPress called");
    sendQuitGameRequest();
  };

  const sendQuitGameRequest = async () => {
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

    const body = {
      gameId: gameId,
    };

    const url = `${EXPO_PUBLIC_BASE_URL}api/games/quitGame`;

    const quitGame = async () => {
      console.log("quitGame called in ViewGame");
      console.log("quitGame body is: ", body);
      console.log("quitGame URL is: ", url);

      try {
        const token = await getTokenFromStorage();

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const requestOptions = {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        };

        await fetch(url, requestOptions)
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            if (data.success === true) {
              console.log("Submit successful");
              navigation.navigate("PlayerBrowseGames", {
                successMessage: "Game quit successfully.",
              });
            } else {
              console.log("Submit Failed");
            }
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    quitGame();
  };

  const onSubmit = async () => {
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

    const body = {
      gameId: gameId,
    };

    const url = `${EXPO_PUBLIC_BASE_URL}api/games/joinGame`;

    const joinGame = async () => {
      console.log("joinGame called in ViewGame");
      console.log("joinGame body is: ", body);
      console.log("joinGame URL is: ", url);

      try {
        const token = await getTokenFromStorage();

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const requestOptions = {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        };

        await fetch(url, requestOptions)
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            if (data.success === true) {
              console.log("Submit successful");
              navigation.navigate("PlayerBrowseGames", {
                successMessage:
                  "Game created successfully. Free Agent pending.",
              });
            } else {
              console.log("Submit Failed");
            }
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    joinGame();
  };

  const displayJoinGameButton = () => {
    if (!game.matchedPlayerId)
      return (
        <TouchableOpacity
          style={{ color: "#C30000" }}
          onPress={() => handleFormSubmit()}
        >
          <View style={{ backgroundColor: "#C30000", borderRadius: 5 }}>
            <Text
              style={[
                Styles.gameInfo,
                (style = {
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "white",
                  borderColor: "#C30000",
                }),
              ]}
            >
              Join Game
            </Text>
          </View>
        </TouchableOpacity>
      );
    if (currentUser?.playerIds?.includes(game.matchedPlayerId)) {
      console.log(currentUser.playerIds + " includes " + game.matchedPlayerId);
      return (
        <TouchableOpacity
          style={{ color: "#C30000" }}
          onPress={() => handleQuitGameButtonPress()}
        >
          <View style={{ backgroundColor: "#C30000", borderRadius: 5 }} on>
            <Text
              style={[
                Styles.gameInfo,
                (style = {
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "white",
                  borderColor: "#C30000",
                }),
              ]}
            >
              Quit Game
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <StatusBar hidden={true} /> */}
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          flex: 0,
        }}
      >
        <View style={Styles.screenHeader}>
          <Image
            source={require("../../assets/prayingHands.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 35, padding: 20 }}>View Game</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={Styles.screenContainer}>
          <View style={{ flex: 1 }}>
            <View style={Styles.viewGameContentContainer}>
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 18,
                  fontWeight: 500,
                  padding: 5,
                }}
              >
                Address
              </Text>

              <Text style={Styles.gameInfo}>{game.location}</Text>
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 18,
                  fontWeight: 500,
                  padding: 5,
                }}
              >
                Date/Time
              </Text>
              <Text
                style={[Styles.gameInfo, (style = { textAlign: "center" })]}
              >
                {game.date} @ {game.time}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
                Position
              </Text>
              <Text style={Styles.gameInfo}>{game.position}</Text>
              <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
                Calibre
              </Text>
              <Text style={Styles.gameInfo}>{game.calibre}</Text>
              <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
                Gender
              </Text>
              <Text style={Styles.gameInfo}>Gender: {game.gender}</Text>
              <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
                Game Type
              </Text>
              <Text style={Styles.gameInfo}>{game.gameType}</Text>
              <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
                Game Length
              </Text>
              <Text style={Styles.gameInfo}>{game.gameLength} Minutes</Text>
            </View>
          </View>
          {displayJoinGameButton()}
        </View>
      </ScrollView>
      <NavigationFooter navigation={navigation}></NavigationFooter>
    </View>
  );
}

export default ViewGame;
