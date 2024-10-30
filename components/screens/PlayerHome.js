import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import NavigationFooter from "./NavigationFooter";
import getCurrentUser from "./getCurrentUser.helper";
import formatDate from "./formatDate";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import MapComponent from "./MapComponent.js";
import ColorToggleButton from "./ColorToggleButton.js";
import authFetch from "../../api/authCalls.js";

function PlayerHome({ navigation }) {
  const [activeGames, setActiveGames] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [playerLocation, setPlayerLocation] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
          console.log("User is", user);
          if (user && user.playerIds.length === 0) {
            setIsModalVisible(true);
          } else {
            console.log("No User found in playerHome fetch");
          }
        } catch (error) {
          console.log(currentUser);
          console.error("Error during currentUser fetch:", error);
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

  useFocusEffect(
    React.useCallback(() => {
      const url = `${EXPO_PUBLIC_BASE_URL}api/games/invites/`;
      console.log("UsefocusEffect Fetch games called");

      const fetchData = async () => {
        try {
          console.log("URL is " + url);

          const headers = {
            "Content-Type": "application/json",
          };

          const requestOptions = {
            headers,
          };

          const response = await authFetch(url, requestOptions);
          console.log(response);
          if (response.body.success) {
            console.log("res was ok");
            setActiveGames(response.body.availableGames);
            setPlayerLocation(response.body.playerLocation);
            return response;
          }
        } catch (error) {
          console.log("Error making authenticated request:", error);
          // Handle error
        }
      };
      fetchData();
    }, [])
  );

  const handleCreateProfilePress = () => {
    {
      setIsModalVisible(false);
      navigation.navigate("CreatePlayer");
    }
  };

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
    <View style={[Styles.playerHomeContainer]}>
      <View style={[Styles.screenHeader]}>
        <Image
          resizeMode="cover"
          source={require("../../assets/prayingHands.png")}
          style={{ width: 50, height: 50, resizeMode: "contain" }}
        />
        <Text style={{ fontSize: 35, padding: 20 }}>Player Home</Text>
      </View>
      <View style={Styles.playerHomeContentContainer}>
        {activeGames && activeGames.length > 0 ? (
          <MapComponent
            activeGames={activeGames}
            navigation={navigation}
            playerLocation={playerLocation}
          />
        ) : (
          <MapComponent activeGames={[]} />
        )}
        {/* Modal for creating player profile */}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                You don't have a player profile. Would you like to create one?
              </Text>
              <TouchableOpacity
                onPress={() => handleCreateProfilePress()}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Create Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%", // Adjust width as needed
    maxWidth: 400, // Set a max width to prevent it from getting too large
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default PlayerHome;
