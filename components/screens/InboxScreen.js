import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect, useFocusEffect } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";

const InboxScreen = ({ navigation }) => {
  let allActiveGames = []; // Initialize as null initially
  const noActiveGames = <Text>No Games yet. Why not?</Text>;

  return (
    <View style={Styles.managerBrowseGamesContainer}>
      <View style={Styles.screenContainer}>
        <View style={Styles.screenHeader}>
          <Image
            source={require("../../assets/chat-regular.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 35, padding: 20 }}>Inbox</Text>
        </View>
      </View>
      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default InboxScreen;
