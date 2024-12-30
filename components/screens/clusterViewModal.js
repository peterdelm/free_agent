import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import Styles from "./Styles";
import { sportIconPath } from "../../utils/sportIcons";
const ClusterViewModal = ({
  isModalVisible,
  onClose,
  activeGames,
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (isModalVisible) {
      setLoading(true);

      // Sort games by date
      const sortedGames = [...activeGames].sort(
        (a, b) =>
          new Date(a.properties.rawDate) - new Date(b.properties.rawDate)
      );

      setGames(sortedGames);
      setLoading(false);

      console.log("Active games in cluster:", activeGames);
    }
  }, [isModalVisible, activeGames]);

  const renderGameItem = ({ properties }) => (
    <TouchableOpacity
      key={properties.index}
      onPress={() => {
        navigation.navigate("ViewGame", {
          gameId: properties.gameId,
          previousScreen: "PlayerHome",
        });
      }}
      style={styles.gameItemContainer}
    >
      <View style={[Styles.upcomingGameContainer]}>
        <View style={styles.gameDetails}>
          <Text>{properties.description}</Text>
        </View>
        <View style={Styles.upcomingGameIconContainer}>
          {properties.sport ? (
            <Image
              source={sportIconPath(properties.sport)}
              style={{
                height: 25,
                width: 25,
                resizeMode: "contain",
              }}
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
              ) : games.length > 0 ? (
                <ScrollView style={styles.gamesList}>
                  {games.map((game) => renderGameItem(game))}
                </ScrollView>
              ) : (
                <Text>No upcoming games found in this cluster.</Text>
              )}
              <TouchableOpacity onPress={onClose} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

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
  gamesList: {
    maxHeight: 300,
    width: "100%",
  },
  gameItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  gameDetails: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sportIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ClusterViewModal;
