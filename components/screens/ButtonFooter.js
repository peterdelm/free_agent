import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Styles from "./Styles";
import { useAuth } from "../../contexts/authContext";

const Footer = ({ navigation, game, handleFormSubmit }) => {
  const { user } = useAuth();

  const handleEditGameButtonPress = () => {
    navigation.navigate("EditGame", {
      gameId: game.id,
      gameSport: game.sport,
    });
  };

  const selectiveDisplay = () => {
    if (user.currentRole == "manager") {
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
            padding: 5,
          }}
        >
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
              <Text
                style={[
                  (style = {
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
                  }),
                ]}
              >
                Edit Game
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    if (user.currentRole == "player") {
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
            padding: 5,
          }}
        >
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
              <Text
                style={[
                  (style = {
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
                  }),
                ]}
              >
                Join Game
              </Text>
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

export default Footer;
