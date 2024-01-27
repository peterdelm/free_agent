import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Footer = ({ navigation, currentRole }) => {
  const selectiveDisplay = () => {
    if (currentRole == "manager") {
      console.log("Current Role is MANAGER");
    }
    if (currentRole == "player") {
      console.log("Current Role is PLAYER");
    }
  };

  selectiveDisplay();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center", // Center items vertically
        height: "8%",
        width: "100%",
        backgroundColor: "lightblue",
        borderWidth: 1,
        borderColor: "darkgreen",
        padding: 5,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/prayingHands.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
          <Text style={{ textAlign: "center" }}>Requests</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ManagerBrowseGames")}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/volleyball-solid.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
          <Text style={{ textAlign: "center" }}>Games</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("InboxScreen")}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/chat-regular.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
          <Text style={{ textAlign: "center" }}>Inbox</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/user-solid.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
          <Text style={{ textAlign: "center" }}>Manage</Text>
        </View>
      </TouchableOpacity>
    </View>
    //   1e3050ff
  );
};

export default Footer;
//   1e3050ff
