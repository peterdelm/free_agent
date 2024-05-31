import { Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import { useAuth } from "../../contexts/authContext.js";

const UserProfile = ({ navigation }) => {
  const [activeGames, setActiveGames] = useState([]);
  const [alternateRoleText, setAlternateRoleText] = useState("");

  const { user, updateUserRole, logout } = useAuth();

  useEffect(() => {
    if (user) {
      updateAlternateRoleText(user.currentRole);
    }
  }, []);

  const updateAlternateRoleText = (currentRole) => {
    if (currentRole === "manager") {
      setAlternateRoleText("Player");
    } else if (currentRole === "player") {
      setAlternateRoleText("Manager");
    }
  };

  const toggleProfile = async () => {
    try {
      const newRole = user.currentRole === "manager" ? "player" : "manager";
      await updateUserRole(newRole);
      updateAlternateRoleText(newRole);
      console.log("User role toggled:", user);
    } catch (error) {
      console.log("Error making authenticated request:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.log("Error during handleLogout: ", error);
    }
  };

  let allActiveGames = [];
  const noActiveGames = <Text>No Games yet. Why not?</Text>;

  if (activeGames.length > 0) {
    allActiveGames = activeGames.map((game, index) => (
      <TouchableOpacity
        key={game.id}
        onPress={() => navigation.navigate("ViewGame", { gameId: game.id })}
      >
        <View key={index} style={Styles.upcomingGameContainer}>
          <View style={Styles.upcomingGameDateContainer}>
            <Text key={index}>{formatDate(game.date)}</Text>
          </View>
          <View style={Styles.upcomingGameAddressContainer}>
            <Text key={index}>{game.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }

  return (
    <View style={Styles.userProfileScreenContainer}>
      <View style={Styles.screenHeader}>
        <Image
          source={require("../../assets/user-solid.png")}
          style={{ width: 50, height: 50, resizeMode: "contain" }}
        />
        <Text style={{ fontSize: 35, padding: 20 }}>Profile</Text>
      </View>
      <View style={Styles.userProfileContentContainer}>
        <View style={Styles.profileLinksContainer}>
          <View style={Styles.profileLinkContainer}>
            <View style={Styles.profileLinkTextContainer}>
              <Text style={{ fontSize: 20, textAlignVertical: "center" }}>
                Show Profile
              </Text>
            </View>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={Styles.profileLinkContainer}
            onPress={() => navigation.navigate("ManagePlayers")}
          >
            <Text style={Styles.profileLinkTextContainer}>
              Manage Player Profiles
            </Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </TouchableOpacity>
          <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Personal Info</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View>
          <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Login/Security</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View>
          <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Settings/Text</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={Styles.profileLinkContainer}
            onPress={() => toggleProfile()}
          >
            <Text style={Styles.profileLinkTextContainer}>
              Switch to {alternateRoleText}
            </Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </TouchableOpacity>
          <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Referrals</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View>
          <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Help</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View>
          <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>How it works</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={Styles.profileLinkContainer}
            onPress={() => {
              handleLogout();
            }}
          >
            <Text style={Styles.profileLinkTextContainer}>Logout </Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </TouchableOpacity>
          <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>
              Terms of Service
            </Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View>
        </View>
      </View>
      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default UserProfile;
