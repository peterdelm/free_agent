import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { View, Text } from "react-native";

function ViewGame({ navigation, message }) {
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

  return (
    <View style={Styles.container}>
      <Text style={Styles.primaryButton}>THIS IS THE GAME SCREEN</Text>
    </View>
  );
}

export default ViewGame;
