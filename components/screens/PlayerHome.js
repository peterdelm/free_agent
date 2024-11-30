import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Styles from "./Styles";
import { useFocusEffect } from "@react-navigation/native";
import NavigationFooter from "./NavigationFooter";
import getCurrentUser from "./getCurrentUser.helper";
import formatDate from "./formatDate";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import MapComponent from "./MapComponent.js";
import ColorToggleButton from "./ColorToggleButton.js";
import authFetch from "../../api/authCalls.js";
import LoadingModal from "./LoadingModal.js";

function PlayerHome({ navigation }) {
  const [activeGames, setActiveGames] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [playerLocation, setPlayerLocation] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch current user and game invites
  useFocusEffect(
    React.useCallback(() => {
      // Fetch current user data
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
          console.log("User is", user);
          if (user && user.playerIds.length === 0) {
            setIsModalVisible(true);
          }
        } catch (error) {
          console.error("Error during currentUser fetch:", error);
        }
      };

      // Fetch active games and player location
      const fetchGames = async () => {
        setLoading(true);

        const url = `${EXPO_PUBLIC_BASE_URL}api/games/invites`;
        console.log("Fetching active games");

        try {
          const headers = {
            "Content-Type": "application/json",
            futureFlag: "true",
            noCreations: "true",
          };

          const requestOptions = {
            headers,
          };

          const response = await authFetch(url, requestOptions);
          if (response.body.success) {
            console.log("Games fetched successfully");
            setActiveGames(response.body.availableGames);
            setPlayerLocation(response.body.playerLocation);
            setLoading(false);
          }
        } catch (error) {
          console.log("Error fetching active games:", error);
        }
      };
      fetchCurrentUser();
      fetchGames();
    }, [])
  );

  const handleCreateProfilePress = () => {
    {
      setIsModalVisible(false);
      navigation.navigate("CreatePlayer");
    }
  };

  let allActiveGames = [];
  const noActiveGames = <Text>No Games yet. Why not?</Text>;
  const currentDate = new Date();

  if (activeGames.length > 0) {
    allActiveGames = activeGames
      .filter(({ game }) => new Date(game.date) > currentDate)
      .sort((a, b) => new Date(a.game.date) - new Date(b.game.date))
      .map(({ game }) => (
        <TouchableOpacity
          key={game.id}
          onPress={() =>
            navigation.navigate("ViewGame", {
              gameId: game.id,
              previousScreen: "PlayerHome",
            })
          }
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
          <MapComponent
            activeGames={[]}
            navigation={navigation}
            playerLocation={playerLocation}
          />
        )}
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
              {loading ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : allActiveGames.length > 0 ? (
                <ScrollView>
                  {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
                </ScrollView>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>No Games Coming Up</Text>
                </View>
              )}
              {/* <ScrollView>
                {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
              </ScrollView> */}
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
