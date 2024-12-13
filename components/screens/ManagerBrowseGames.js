import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";
import getCurrentUser from "./getCurrentUser.helper";
import { useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";
import UserQuestionnairePopup from "./UserQuestionnaireModal.js";
import { sportIconPath } from "../../utils/sportIcons.js";

const ManagerBrowseGames = ({ navigation, route }) => {
  const [activeGames, setActiveGames] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFeedBackPopupVisible, setIsFeedBackPopupVisible] = useState(false);

  const { feedbackPopup } = route.params || {};

  // Function to close the modal
  const closeModal = () => {
    setIsFeedBackPopupVisible(false);
  };

  const fetchData = async () => {
    try {
      const url = `${EXPO_PUBLIC_BASE_URL}api/games/active`;

      const headers = {
        "Content-Type": "application/json",
      };

      const requestOptions = {
        headers,
      };

      const res = await authFetch(url, requestOptions);
      if (res.status === 200) {
        const data = res.body;
        setActiveGames(data.availableGames || []);
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error making authenticated request:", error);
      // Optionally set an error state to display an error message
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      };
      fetchCurrentUser();
      fetchData();
      console.log("Route Params are", route.params);
      if (feedbackPopup === true) {
        setIsFeedBackPopupVisible(true);
        console.log("Feedback popup in useFocusEffect is ", feedbackPopup);
      }
      if (feedbackPopup === false) {
        setIsFeedBackPopupVisible(false);
        console.log("Feedback popup in useFocusEffect is ", feedbackPopup);
      }
    }, [route.params])
  );

  useEffect(() => {
    fetchData();
    if (feedbackPopup === true) {
      setIsFeedBackPopupVisible(true);
      console.log("Route Params are", route.params);

      console.log("Feedback popup in useEffect is ", feedbackPopup);
    }
    if (feedbackPopup === false) {
      setIsFeedBackPopupVisible(false);
      console.log("Feedback popup in useFocusEffect is ", feedbackPopup);
    }
  }, [route.params]);

  const currentDate = new Date();

  let allUpcomingGames = [];
  let allPreviousGames = [];

  const noActiveGames = <Text>No Games yet. Why not?</Text>;
  const formattedLocation = (location) => {
    console.log("Unformatted Location", location);

    // Split the location by commas
    const parts = location.split(",");

    // Keep the first parts until the second-to-last one (city + province)
    const addressWithoutCountryAndPostal = parts
      .slice(0, parts.length - 2)
      .join(",")
      .trim();

    console.log("Formatted Location", addressWithoutCountryAndPostal);
    return addressWithoutCountryAndPostal;
  };

  const parse24HourTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return { hours, minutes, seconds };
  };
  // Function to convert 24-hour time to 12-hour format
  const convertTo12HourFormat = (hours) => {
    const amPm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0 hours to 12 for AM
    return { hours12, amPm };
  };

  // Main function to format time string
  const formatTime = (timeString) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
      return "Invalid time"; // Return a fallback message or value
    }
    const { hours, minutes } = parse24HourTime(timeString);
    const { hours12, amPm } = convertTo12HourFormat(hours);
    return `${hours12}:${String(minutes).padStart(2, "0")} ${amPm}`;
  };

  if (activeGames) {
    allUpcomingGames = activeGames
      .filter(({ game }) => new Date(game.date) > currentDate)
      .sort((a, b) => new Date(a.game.date) - new Date(b.game.date)) // Sort games by date descending
      .map(({ game }) => (
        <TouchableOpacity
          key={game.id}
          onPress={() => {
            navigation.setParams({ feedbackPopup: false }),
              navigation.navigate("ViewGame", { gameId: game.id });
          }}
        >
          <View style={[Styles.upcomingGameContainer]}>
            <View style={[Styles.upcomingGameDateContainer, { width: "22%" }]}>
              <Text>{formatDate(game.date)}</Text>
              <Text>{formatTime(game.time)}</Text>
            </View>
            <View style={Styles.upcomingGameAddressContainer}>
              <View style={{ flexDirection: "column", flex: 1, flexShrink: 1 }}>
                {game.locationName ? (
                  <Text
                    style={{
                      flex: 1,
                      flexShrink: 1,
                    }}
                  >
                    {game.locationName}
                  </Text>
                ) : null}

                <Text
                  style={{
                    flex: 1,
                    flexShrink: 1,
                  }}
                >
                  {formattedLocation(game.location)}
                </Text>
              </View>
              <View style={Styles.upcomingGameIconContainer}>
                {game.sport ? (
                  <Image
                    source={sportIconPath(game.sport)}
                    style={{
                      height: 25,
                      width: 25,
                      resizeMode: "contain",
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ));

    allPreviousGames = activeGames
      .filter(({ game }) => new Date(game.date) <= currentDate)
      .sort((a, b) => new Date(a.game.date) - new Date(b.game.date)) // Sort games by date descending
      .map(({ game }) => (
        <TouchableOpacity
          key={game.id}
          onPress={() => {
            navigation.navigate("ViewGame", {
              gameId: game.id,
            });
          }}
        >
          <View style={[Styles.upcomingGameContainer]}>
            <View style={[Styles.upcomingGameDateContainer, { width: "22%" }]}>
              <Text>{formatDate(game.date)}</Text>
              <Text>{formatTime(game.time)}</Text>
            </View>
            <View style={Styles.upcomingGameAddressContainer}>
              <View style={{ flexDirection: "column", flex: 1, flexShrink: 1 }}>
                {game.locationName ? (
                  <Text
                    style={{
                      flex: 1,
                      flexShrink: 1,
                    }}
                  >
                    {game.locationName}
                  </Text>
                ) : null}

                <Text
                  style={{
                    flex: 1,
                    flexShrink: 1,
                  }}
                >
                  {formattedLocation(game.location)}
                </Text>
              </View>
              <View style={Styles.upcomingGameIconContainer}>
                {game.sport ? (
                  <Image
                    source={sportIconPath(game.sport)}
                    style={{
                      height: 25,
                      width: 25,
                      resizeMode: "contain",
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ));
  }

  return (
    <View style={Styles.managerBrowseGamesContainer}>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          width: "100%",
        }}
      >
        <View
          style={[Styles.screenHeader, (style = { justifyContent: "center" })]}
        >
          <Image
            source={require("../../assets/volleyball-solid.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 35, padding: 20 }}>Manager Games</Text>
        </View>
      </View>
      <View style={Styles.managerBrowseGamesContentContainer}>
        <View style={Styles.managerBrowseGamesContainerHeader}>
          <Text style={{ fontSize: 30 }}>Upcoming Games</Text>
        </View>
        <View
          style={[
            Styles.pendingGamesContainer,
            (style = {
              flex: 1,
              justifyContent: "center",
            }),
          ]}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : allUpcomingGames.length > 0 ? (
            <ScrollView>
              {allUpcomingGames.length > 0 ? allUpcomingGames : noActiveGames}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No Games Coming Up</Text>
            </View>
          )}
        </View>
        <View style={Styles.managerBrowseGamesContainerHeader}>
          <Text style={{ fontSize: 30 }}>Previous Games</Text>
        </View>
        <View
          style={[
            Styles.pendingGamesContainer,
            { marginBottom: 12, flex: 1, justifyContent: "center" },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : allPreviousGames.length > 0 ? (
            <ScrollView>
              {allPreviousGames.length > 0 ? allPreviousGames : noActiveGames}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No Games Played</Text>
            </View>
          )}
        </View>
      </View>
      <UserQuestionnairePopup
        isModalVisible={isFeedBackPopupVisible}
        onClose={closeModal}
      />

      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default ManagerBrowseGames;
