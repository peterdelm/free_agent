import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SportsPicker from "./SportsPicker";
import Picker from "./Picker";
import AutoCompletePicker from "./AutocompletePicker";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import NavigationFooter from "./NavigationFooter";
import getCurrentUser from "./getCurrentUser.helper";
import formatDate from "./formatDate";

function PlayerHome({ navigation }) {
  const [activeGames, setActiveGames] = useState([]);
  const [selectedSport, setSelectedSport] = useState({});
  const [calibre, setCalibre] = useState("");
  const [gender, setGender] = useState("");
  const [gameType, setGameType] = useState("");
  const [location, setGameAddress] = useState("");
  const [date, setGameDate] = useState("");
  const [time, setGameTime] = useState("");
  const [game_length, setGameLength] = useState("");
  const [team_name, setTeamName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [genderList, setGenderList] = useState(["Any", "Male", "Female"]);

  const [selectedSportId, setSelectedSportId] = useState();
  const [position, setPosition] = useState("");

  const [currentUser, setCurrentUser] = useState({});

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
    }, [])
  );

  captureSelectedLocation = (selectedInput) => {
    console.log("Selected Location input: " + selectedInput);
    setGameAddress(selectedInput);
  };

  const route = useRoute();
  const successMessage = route.params || {};
  console.log("Success message is...");
  console.log(successMessage["successMessage"]);

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
      const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games/active";
      console.log("UsefocusEffect Fetch games called");

      const fetchData = async () => {
        try {
          const token = await getTokenFromStorage();
          console.log("Token is " + token);
          console.log("URL is " + url);

          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

          const requestOptions = {
            headers,
          };

          fetch(url, requestOptions)
            .then((res) => {
              if (res.ok) {
                console.log("res was ok");
                return res.json();
              } else throw new Error("Network response was not ok.");
            })
            .then((res) => setActiveGames(res.activeGames))
            .catch((error) => {
              console.log("Error during fetch:", error);
              // Handle specific error scenarios
            });
        } catch (error) {
          console.log("Error making authenticated request:", error);
          // Handle error
        }
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games/active";

    const fetchData = async () => {
      try {
        const token = await getTokenFromStorage();
        console.log("Token is " + token);
        console.log("URL is " + url);

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const requestOptions = {
          headers,
        };

        fetch(url, requestOptions)
          .then((res) => {
            if (res.ok) {
              console.log("res was ok");
              return res.json();
            } else throw new Error("Network response was not ok.");
          })
          .then((res) => setActiveGames(res.activeGames))
          .catch((error) => {
            console.log("Error during fetch:", error);
            // Handle specific error scenarios
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  const validateInputs = () => {
    if (!calibre) {
      console.log(calibre);

      console.log("No Calibre");
      // handleError("Please input calibre", "calibre");
    }
  };

  const onSubmit = () => {
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

    validateInputs();
    const body = {
      gender,
      calibre,
      position,
      gameType,
      date,
      //stand in Location until credit renewal
      location: "123 Jasper Street",
      time,
      gameLength,
      teamName,
      additionalInfo,
      isActive: true,
      sport: selectedSport.sport,
      sportId: selectedSportId,
    };

    console.log("CreateGame Request body is: " + body);
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games";

    const postGame = async () => {
      try {
        const token = await getTokenFromStorage();
        console.log("Token is " + token);
        console.log("URL is " + url);
        console.log("postgGame async request called at line 138");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const requestOptions = {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        };

        await fetch(url, requestOptions)
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            if (data.success === true) {
              console.log("Submit successful");
              navigation.navigate("Home", {
                successMessage:
                  "Game created successfully. Free Agent pending.",
              });
            } else {
              console.log("Submit Failed");
            }
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    postGame();
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
    <View style={Styles.playerHomeContainer}>
      <View style={Styles.screenHeader}>
        <Image
          resizeMode="cover"
          source={require("../../assets/prayingHands.png")}
          style={{ width: 50, height: 50, resizeMode: "contain" }}
        />
        <Text style={{ fontSize: 35, padding: 20 }}>Player Home</Text>
      </View>
      <View style={Styles.playerHomeContentContainer}>
        <View style={Styles.playerHomeMapContainer}>
          <Image
            resizeMode="cover"
            source={require("../../assets/standin-map.jpg")}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <View style={Styles.playerHomeTextContentContainer}>
          <View style={Styles.playerHomeAvailableGamesContainer}>
            <View style={[Styles.playerHomeAvailableGamesHeader]}>
              <Text style={{ fontSize: 20 }}>Available Games</Text>
            </View>
            <View style={Styles.availableGamesScroller}>
              <ScrollView>
                {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
              </ScrollView>
            </View>
          </View>
          <View style={Styles.goOfflineButtonContainer}>
            <TouchableOpacity
              onPress={() => console.log("goOffline Button Pressed")}
            >
              <View style={Styles.goOfflineButton}>
                <Image
                  source={require("../../assets/chevron-right-solid.png")}
                  style={Styles.goOfflineButtonImage}
                />
                <Text style={Styles.goOfflineButtonText}>Go Offline</Text>
              </View>
            </TouchableOpacity>
          </View>
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
}

export default PlayerHome;
