import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";
import getCurrentUser from "./getCurrentUser.helper";
import { useFocusEffect } from "@react-navigation/native";

const UserProfile = ({ navigation }) => {
  const [activeGames, setActiveGames] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [alternateRoleText, setAlternateRoleText] = useState("");

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
          setAlternateRole(user.currentRole);
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      };
      fetchCurrentUser();
    }, [])
  );

  const sendToggleProfileRequest = () => {
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/users/";

    const toggleProfileRequest = async () => {
      try {
        const token = await getTokenFromStorage();
        console.log("Token is " + token);
        console.log("URL is " + url);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const body = {
          addressFragment: "addressFragment",
        };

        const request = {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        };

        const response = await fetch(url, request);
        if (response.ok) {
          // Parse and use the data
          const userData = await response.json();
          console.log("User data:", userData);
          setAlternateRole(userData.newProfile);

          return userData;
        } else {
          // Handle non-ok responses
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.log("Error making authenticated request:", error);
      }
    };
    toggleProfileRequest();
  };

  const swapProfileText = () => {};

  const toggleProfile = () => {
    sendToggleProfileRequest();
  };

  const setAlternateRole = (currentRole) => {
    if (currentRole === "manager") {
      setAlternateRoleText("Player");
    } else if (currentRole === "player") {
      setAlternateRoleText("Manager");
    }
  };

  let allActiveGames = []; // Initialize as null initially
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
      <View
        style={[
          Styles.screenHeader,
          { borderBottomColor: "black", borderBottomWidth: 2 },
        ]}
      >
        <Image
          source={require("../../assets/user-solid.png")}
          style={{ width: 50, height: 50, resizeMode: "contain" }}
        />
        <Text
          style={{
            fontSize: 35,
            padding: 20,
          }}
        >
          Profile
        </Text>
      </View>
      <View style={Styles.userProfileContentContainer}>
        <View style={Styles.profileLinksContainer}>
          <View style={Styles.profileLinkContainer}>
            <View style={Styles.profileLinkTextContainer}>
              <Text
                style={{
                  fontSize: 20,
                  textAlignVertical: "center",
                }}
              >
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
            onPress={() => {
              toggleProfile(), swapProfileText();
            }}
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
          <TouchableOpacity
            style={Styles.profileLinkContainer}
            onPress={() => {
              navigation.navigate("WelcomeScreen");
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
        </View>
      </View>

      <NavigationFooter
        currentRole={currentUser.currentRole}
        navigation={navigation}
      >
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default UserProfile;
