import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { useAuth } from "../../contexts/authContext";

const Footer = ({ navigation }) => {
  const { user } = useAuth();

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
            flex: 0,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("ManagerHome")}>
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
            flex: 0,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("PlayerHome")}>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/user-plus-solid.png")}
                style={{ width: 25, height: 25, resizeMode: "contain" }}
              />
              <Text style={{ textAlign: "center" }}>Requests</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PlayerBrowseGames")}
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
