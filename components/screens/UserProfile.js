import { Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";
import { useAuth } from "../../contexts/authContext.js";
import ConfirmLogoutPopup from "./ConfirmLogoutPopup.js";
import SwitchingManagerPlayerModal from "./SwitchingManagerPlayerModal.js";
import CustomButton from "./CustomButton.js";
import { useFocusEffect } from "@react-navigation/native";
import getCurrentUser from "./getCurrentUser.helper.js";

const UserProfile = ({ navigation }) => {
  const [activeGames, setActiveGames] = useState([]);
  const [alternateRoleText, setAlternateRoleText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingScreenVisible, setLoadingScreenVisible] = useState(false);
  const { user, updateUserRole, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
          console.log("User is", user);
        } catch (error) {
          console.log(currentUser);
          console.error("Error during currentUser fetch:", error);
        }
      };
      fetchCurrentUser();
    }, [])
  );

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

    setTimeout(() => {
      closeLoadingScreen();
      toggleProfile();
    }, 2000);
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
  const openModal = () => setIsModalVisible(true);

  // Function to close the modal
  const closeModal = () => setIsModalVisible(false);

  const openLoadingScreen = () => setLoadingScreenVisible(true);

  const closeLoadingScreen = () => setLoadingScreenVisible(false);

  let allActiveGames = [];

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
        <Text style={{ fontSize: 35, padding: 20 }}>
          {alternateRoleText === "Manager"
            ? "Player Profile"
            : "Manager Profile"}
        </Text>
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

          {/* *** TODO: HOOK UP THIS BUTTON AND IMPLEMENT IT *** */}

          {/* <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Personal Info</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View> */}

          {/* *** TODO: HOOK UP THIS BUTTON AND IMPLEMENT IT *** */}

          {/* <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Login/Security</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View> */}

          {/* *** TODO: HOOK UP THIS BUTTON AND IMPLEMENT IT *** */}

          {/* <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Settings/Text</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View> */}
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

          {/* *** TODO: HOOK UP THIS BUTTON AND IMPLEMENT IT *** */}

          {/* <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>
              Push Notifications
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                flex: 0,
              }}
            >
              {currentUser && <CustomButton user={currentUser} />}
            </View>
          </View> */}
          {/* <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>Help</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View> */}
          {/* <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>How it works</Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View> */}
          <TouchableOpacity
            style={Styles.profileLinkContainer}
            onPress={() => openModal()}
          >
            <Text style={Styles.profileLinkTextContainer}>Logout </Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </TouchableOpacity>

          {/* *** TODO: HOOK UP THIS BUTTON AND IMPLEMENT IT *** */}

          {/* <View style={Styles.profileLinkContainer}>
            <Text style={Styles.profileLinkTextContainer}>
              Terms of Service
            </Text>
            <View style={Styles.profileLinkImageContainer}>
              <Image
                source={require("../../assets/chevron-right-solid.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
          </View> */}
          <ConfirmLogoutPopup
            isModalVisible={isModalVisible}
            handleButtonPress={handleLogout}
            onClose={closeModal}
          />
          <SwitchingManagerPlayerModal
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
