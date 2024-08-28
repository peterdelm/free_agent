import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import NavigationFooter from "./NavigationFooter";
import getCurrentUser from "./getCurrentUser.helper";
import { useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";

function ViewGame({ navigation, message }) {
  const [currentUser, setCurrentUser] = useState({});

  const route = useRoute();
  const { gameId } = route.params;
  const [game, setGame] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLoading, setUserLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
          setUserLoading(false);
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      };
      fetchCurrentUser();
    }, [])
  );

  useEffect(() => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/games/${gameId}`;

    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          headers,
        };

        const res = await authFetch(url, requestOptions);

        authFetch(url, requestOptions);
        if (res.status === 200) {
          console.log("GameView fetch res is", res.body);
          const gameData = res.body.game;
          setGame(gameData);
        } else console.log("Something in ViewGame fetch returned incorrectly");
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

  const formattedDate = (isoDateString) => {
    const date = new Date(isoDateString);

    // Define options for the desired date format
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Format the date using options
    const formattedDate = date.toLocaleDateString(undefined, options); // Example: "August 13, 2024"
    console.log("Formatted date is:", formattedDate);
    return formattedDate;
  };
  const parse24HourTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return { hours, minutes, seconds };
  };

  // Function to convert 24-hour time to 12-hour format
  const convertTo12HourFormat = (hours) => {
    const amPm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0 hours to 12 for AM
    return { hours12, amPm };
  };

  // Main function to format time string
  const formatTime = (timeString) => {
    // Validate and parse the 24-hour time string
    if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
      return "Invalid time"; // Return a fallback message or value
    }

    // Parse the 24-hour time
    const { hours, minutes } = parse24HourTime(timeString);

    // Convert hours to 12-hour format
    const { hours12, amPm } = convertTo12HourFormat(hours);

    // Format the time string
    return `${hours12}:${String(minutes).padStart(2, "0")} ${amPm}`;
  };

  // Example usage

  const displayJoinGameButton = () => {
    if (userLoading) {
      return null;
    }
    if (game.userId === currentUser?.id) {
      console.log("You created this game", game.userId);
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
              Edit Game
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
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

  const displayYourGameBar = () => {
    if (userLoading) {
      return null;
    }
    if (game.userId === currentUser?.id) {
      return (
        <View style={{ backgroundColor: "#C30000", borderRadius: 5 }} on>
          <Text
            style={[
              (style = {
                fontWeight: "bold",
                fontSize: 15,
                color: "white",
                borderColor: "#C30000",
                textAlign: "center",
                padding: 2,
              }),
            ]}
          >
            Cannot Accept Your Own Request
          </Text>
        </View>
      );
    }
    if (!game.matchedPlayerId) return null;
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
                // (style = {
                //   fontWeight: "bold",
                //   fontSize: 20,
                //   color: "white",
                //   borderColor: "#C30000",
                // }),
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/prayingHands.png")}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>View Game</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.gameInfo}>{game.location}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Date/Time</Text>
          <Text style={styles.gameInfo}>
            {formattedDate(game.date)} @ {formatTime(game.time)}
          </Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Position</Text>
          <Text style={styles.gameInfo}>{game.position}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Calibre</Text>
          <Text style={styles.gameInfo}>{game.calibre}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.gameInfo}>{game.gender}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Game Type</Text>
          <Text style={styles.gameInfo}>{game.gameType}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Game Length</Text>
          <Text style={styles.gameInfo}>
            {game.gameLength ? `${game.gameLength} Minutes` : "N/A"}
          </Text>
        </View>
        {displayJoinGameButton()}
      </View>

      <NavigationFooter navigation={navigation} />
    </View>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  headerImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 35,
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 10,
    // Adjust this height if needed to fit content within the screen
    maxHeight: height - 150, // Adjust based on footer height and margins
  },
  infoSection: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    paddingBottom: 5,
  },
  gameInfo: {
    fontSize: 16,
  },
});

export default ViewGame;
