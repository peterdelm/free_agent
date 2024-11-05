import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/authContext";

const Footer = ({
  navigation,
  game,
  handleFormSubmit,
  handleQuitGameButtonPress,
  isGameCreator,
  hasPlayer,
  isMatchedPlayer,
}) => {
  const { user } = useAuth();

  const handleEditGameButtonPress = () => {
    navigation.navigate("EditGame", {
      gameId: game.id,
      gameSport: game.sport,
    });
  };

  const selectiveDisplay = () => {
    if (isGameCreator && !hasPlayer) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{ color: "#C30000", width: "100%" }}
            onPress={() => handleEditGameButtonPress()}
          >
            <View
              style={{
                backgroundColor: "#C30000",
                borderRadius: 5,
                width: "100%",
              }}
            >
              <Text style={styles.buttonText}>Edit Game</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (isGameCreator && hasPlayer) {
      //return greyed out edit
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{ color: "#C30000", width: "100%" }}
            onPress={() =>
              alert(
                "You cannot make changes to a game once a player has accepted it."
              )
            }
          >
            <View
              style={{
                backgroundColor: "grey",
                borderRadius: 5,
                width: "100%",
              }}
            >
              <Text style={styles.buttonText}>Edit Game</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    if (!isGameCreator && !hasPlayer) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => handleFormSubmit()}
          >
            <View
              style={{
                backgroundColor: "green",
                borderRadius: 5,
                width: "100%",
              }}
            >
              <Text style={styles.buttonText}>Join Game</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (isGameCreator && !hasPlayer) {
      return (
        <View style={{ backgroundColor: "#C30000", borderRadius: 5 }} on>
          <Text
            style={[
              {
                fontWeight: "bold",
                fontSize: 15,
                color: "white",
                borderColor: "#C30000",
                textAlign: "center",
                padding: 2,
              },
            ]}
          >
            Cannot Accept Your Own Request
          </Text>
        </View>
      );
    } else if (isMatchedPlayer) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              borderRadius: 5,
              width: "100%",
            }}
            onPress={() => handleQuitGameButtonPress()}
          >
            <View style={{ backgroundColor: "#C30000", borderRadius: 5 }} on>
              <Text style={styles.buttonText}>Quit Game</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 60,
        width: "100%",
        bottom: 0,
        backgroundColor: "lightblue",
        borderWidth: 1,
        flex: 0,
      }}
    >
      {selectiveDisplay()}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    width: "100%",
    bottom: 0,
    backgroundColor: "lightblue",
    borderWidth: 1,
    padding: 5,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    borderColor: "#C30000",
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    textAlign: "center",
    justifyContent: "center",
  },
});

export default Footer;
