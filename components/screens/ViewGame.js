import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import ButtonFooter from "./ButtonFooter.js";
import getCurrentUser from "./getCurrentUser.helper";
import ConfirmQuitGame from "./ConfirmQuitGame.js";
import { quitGameRequest, deleteGameRequest } from "../../api/apiCalls.js";
import { useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";
import DeleteGamePopup from "./DeleteGamePopup.js";

function ViewGame({ navigation, message }) {
  const [currentUser, setCurrentUser] = useState({});
  const route = useRoute();
  const { gameId, refresh } = route.params;
  const [game, setGame] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshGame, setRefreshGame] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTrashModalVisible, setIsTrashModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);

  const closeModal = () => setIsModalVisible(false);

  const openTrashModal = () => setIsTrashModalVisible(true);

  const closeTrashModal = () => setIsTrashModalVisible(false);

  useEffect(() => {
    if (refresh) {
      setRefreshGame(true);
    }
  }, [refresh]);

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true); // Start loading state
        try {
          const url = `${EXPO_PUBLIC_BASE_URL}api/games/${gameId}`;
          const headers = { "Content-Type": "application/json" };
          const requestOptions = { headers };

          const res = await authFetch(url, requestOptions);

          if (res.status === 200) {
            const gameData = res.body.game;
            console.log(gameData);
            console.log(currentUser.id);
            setGame(gameData);
          } else {
            throw new Error("Network response was not ok.");
          }
        } catch (error) {
          console.error("Error fetching game data:", error);
          setErrorMessage("Failed to load game data."); // Display error to user if needed
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [gameId, refreshGame])
  );

  const handleFormSubmit = () => {
    onSubmit();
  };

  const handleQuitGameButtonPress = async () => {
    console.log("handleQuitGameButtonPress pressed");

    try {
      const response = await quitGameRequest(gameId);
      console.log("response is", response);

      if (response.status === 200) {
        console.log("Submit successful");
        navigation.navigate("PlayerBrowseGames", {
          successMessage: "Game quit successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting Game:", error);
    }
  };

  const handleDeleteGameButtonPress = async () => {
    try {
      const response = await deleteGameRequest(gameId);

      if (response.status === 200) {
        console.log("Game deleted successfully");
        navigation.navigate("ManagerBrowseGames", {
          successMessage: "Game deleted successfully.",
          feedbackPopup: true,
        });
      }
    } catch (error) {
      console.error("Error deleting Game:", error);
    }
  };
  const onSubmit = async () => {
    const body = {
      gameId: gameId,
    };

    const url = `${EXPO_PUBLIC_BASE_URL}api/games/joinGame/${gameId}`;

    const joinGame = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        };

        const response = await authFetch(url, requestOptions);
        if (response.status === 200) {
          console.log("Submit successful");
          navigation.navigate("PlayerBrowseGames", {
            successMessage: "Game created successfully. Free Agent pending.",
          });
        } else {
          console.log("Response was not ok");
        }
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    joinGame();
  };
  const isGamePast = (isoDateString) => {
    console.log("Is Game Past?");
    const date = new Date(isoDateString);

    if (isNaN(date)) {
      console.error("Invalid date:", isoDateString);
      return false;
    }

    const currentDate = new Date();

    return date < currentDate;
  };

  const formattedDate = (isoDateString) => {
    const date = new Date(isoDateString);

    if (isNaN(date)) {
      console.error("Invalid date:", isoDateString);
    }

    // Define options for the desired date format
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Format the date using options
    const formattedDate = date.toLocaleDateString(undefined, options); // Example: "August 13, 2024"
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
    if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
      return "Invalid time"; // Return a fallback message or value
    }
    const { hours, minutes } = parse24HourTime(timeString);
    const { hours12, amPm } = convertTo12HourFormat(hours);
    return `${hours12}:${String(minutes).padStart(2, "0")} ${amPm}`;
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const isGameCreator = game.userId === currentUser?.id;
  const hasPlayer = Boolean(game.matchedPlayerId);
  const isMatchedPlayer = currentUser?.playerIds?.includes(
    game.matchedPlayerId
  );

  const displayGameStatus = () => {
    //Check if the game has a player
    if (hasPlayer) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ViewPlayer", {
              playerId: game.matchedPlayerId,
              userId: currentUser?.id,
            })
          }
        >
          <View
            style={{
              backgroundColor: "green",
              borderRadius: 5,
              width: "98%",
              height: 50,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <Text
              style={[
                (style = {
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "white",
                  borderWidth: 0,
                  textAlign: "center",
                  marginLeft: 20,
                }),
              ]}
            >
              Player Found
            </Text>
            <Image
              source={require("../../assets/user-solid.png")}
              style={{
                width: 25,
                height: 25,
                resizeMode: "contain",
                marginRight: 20,
                tintColor: "white",
              }}
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const displayTrashBin = () => {
    if (isGameCreator) {
      return (
        <View style={{ paddingRight: 20 }}>
          <TouchableOpacity onPress={() => openTrashModal()}>
            <Image
              source={require("../../assets/trash-can.png")}
              style={{
                width: 25,
                height: 25,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ paddingRight: 40 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/arrow-left-solid.png")}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={require("../../assets/prayingHands.png")}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>View Game</Text>
        {displayTrashBin()}
      </View>
      <ScrollView>
        <View style={[styles.content]}>
          {displayGameStatus()}
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
          <View style={styles.infoSection}>
            <Text style={styles.label}>Additional Info</Text>
            <Text style={styles.gameInfo}>{game.additionalInfo || "None"}</Text>
          </View>
        </View>
      </ScrollView>
      <ButtonFooter
        navigation={navigation}
        game={game}
        isGameCreator={isGameCreator}
        hasPlayer={hasPlayer}
        isMatchedPlayer={isMatchedPlayer}
        isGamePast={isGamePast(game.date)}
        handleQuitGameButtonPress={openModal}
        handleFormSubmit={handleFormSubmit}
      />
      <ConfirmQuitGame
        isModalVisible={isModalVisible}
        handleButtonPress={handleQuitGameButtonPress}
        onClose={closeModal}
      />
      <DeleteGamePopup
        isModalVisible={isTrashModalVisible}
        handleButtonPress={handleDeleteGameButtonPress}
        onClose={closeTrashModal}
      />
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
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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
    alignItems: "center",
  },
  infoSection: {
    width: "100%",
    marginBottom: 15,
    paddingLeft: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    paddingBottom: 5,
  },
  gameInfo: {
    fontSize: 16,
    textAlign: "left",
  },
});

export default ViewGame;
