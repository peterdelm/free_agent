import { Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import { useAuth } from "../../contexts/authContext.js";
import ConfirmLogoutPopup from "./ConfirmLogoutPopup.js"; // Adjust import path as needed
import SwitchingManagerPlayerModal from "./SwitchingManagerPlayerModal.js";

const UserProfile = ({ navigation }) => {
  const [activeGames, setActiveGames] = useState([]);
  const [alternateRoleText, setAlternateRoleText] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoadingScreenVisible, setLoadingScreenVisible] = useState(false);
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

  const showLoadingWithTimeout = (switchToValue) => {
    openLoadingScreen();

    // Set a timeout to close the modal after 2 seconds
    setTimeout(() => {
      closeLoadingScreen();
      toggleProfile();
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.log("Error during handleLogout: ", error);
    }
  };

  // Function to open the modal
  const openModal = () => setModalVisible(true);

  // Function to close the modal
  const closeModal = () => setModalVisible(false);

  const openLoadingScreen = () => setLoadingScreenVisible(true);

  const closeLoadingScreen = () => setLoadingScreenVisible(false);

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
          <TouchableOpacity
            style={Styles.profileLinkContainer}
            onPress={() =>
              navigation.navigate("ViewUser", { userId: user.userId })
            }
          >
            <Text style={Styles.profileLinkTextContainer}>Show Profile</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </TouchableOpacity>
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
            onPress={showLoadingWithTimeout}
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
            onPress={openModal}
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
          <ConfirmLogoutPopup
            isModalVisible={isModalVisible}
            handleButtonPress={handleLogout}
            onClose={closeModal}
          />
          <SwitchingManagerPlayerModal
            handleButtonPress={handleLogout}
            onClose={closeLoadingScreen}
            isVisible={isLoadingScreenVisible}
            switchTo={alternateRoleText}
          />
        </View>
      </View>
      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default UserProfile;
