import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Keyboard,
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
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

function HomeScreen({ navigation, message }) {
  const [activeGames, setActiveGames] = useState([]);
  const [sportSpecificValues, setSportSpecificValues] = useState();
  const [selectedSport, setSelectedSport] = useState({});
  const [calibreList, setCalibreList] = useState([]);
  const [calibre, setCalibre] = useState("");

  const [gender, setGender] = useState("");
  const [gameType, setGameType] = useState("");
  const [location, setGameAddress] = useState("");
  const [date, setGameDate] = useState("");
  const [time, setGameTime] = useState("");
  const [gameLength, setGameLength] = useState("");
  const [teamName, setTeamName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [gameTypeList, setGameTypeList] = useState([]);
  const [genderList, setGenderList] = useState(["Any", "Male", "Female"]);
  const [gameLengthList, setGameLengthList] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState();
  const [position, setPosition] = useState("");
  const [positionList, setPositionList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  const handleSportChange = (selectedSport) => {
    setSelectedSport(selectedSport);
    setCalibreList(selectedSport.calibre);
    setGameTypeList(selectedSport.gameType);
    setGameLengthList(selectedSport.gameLength);
    setPositionList(selectedSport.position);
    setSelectedSportId(selectedSport.id);

    console.log("Selected sport is:", selectedSport.sport);
    console.log("Selected sport details:", selectedSport.calibre);
  };

  captureSelectedDate = (selectedInput) => {
    console.log("Selected Date input: " + selectedInput);
    setGameDate(selectedInput);
  };
  captureSelectedTime = (selectedInput) => {
    console.log("Selected Time input: " + selectedInput);
    setGameTime(selectedInput);
  };

  const handleCalibreChange = (input) => {
    setCalibre(input);
  };
  const handleGenderChange = (input) => {
    setGender(input);
  };
  const handleGameLengthChange = (input) => {
    setGameLength(input);
  };
  const handleGameTypeChange = (input) => {
    setGameType(input);
  };
  const handlePositionChange = (input) => {
    setPosition(input);
  };

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
      const fetchUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      const user = fetchUser();
      console.log(user.currentRole);

      const url = `${EXPO_PUBLIC_BASE_URL}api/games/active`;
      console.log("UsefocusEffect Fetch games called");
    }, [])
  );

  //Retrieve the relevant values for the selected sport
  useEffect(() => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/sports`;

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
              return res.json();
            } else throw new Error("Network response was not ok.");
          })
          .then((res) => {
            setSportSpecificValues(res.sports);

            console.log("Results are...");
            console.log(res.sports);
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

  const onSubmit = async () => {
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

    const dateString = date.dateString;

    validateInputs();
    const body = {
      gender,
      calibre,
      position,
      gameType,
      date: dateString,
      location: location,
      time,
      gameLength,
      teamName,
      additionalInfo,
      isActive: true,
      sport: selectedSport.sport,
      sportId: selectedSportId,
    };

    console.log("CreateGame Request date is: " + body.date);
    const url = `${EXPO_PUBLIC_BASE_URL}api/games`;

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
              // Reset state values
              setGender("");
              setGameType("");
              setGameAddress("");
              setGameDate("");
              setGameTime("");
              setGameLength("");
              setTeamName("");
              setAdditionalInfo("");
              setSelectedSport({});
              setCalibreList([]);
              setCalibre("");
              setGameTypeList([]);
              setGameLengthList([]);
              setPosition("");
              setPositionList([]);
              console.log("Submit successful");
              navigation.navigate("ManagerBrowseGames", {
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

  const handleFormSubmit = () => {
    onSubmit();
  };

  function Banner({ message }) {
    const result = message["successMessage"] || "";
    const isMessageEmpty = result === "";

    if (isMessageEmpty) {
      return null; // Don't render anything if the message is empty
    }

    //set a timer
    //do a slide animation
    //highlight the new game for a few seconds
    return (
      <View>
        <Text style={Styles.successBanner}>{result}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 2,
            borderBottomStyle: "solid",
          }}
        >
          <View style={Styles.screenHeader}>
            <Image
              source={require("../../assets/prayingHands.png")}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
            <Text style={{ fontSize: 35, padding: 20 }}>Request a Player</Text>
          </View>
        </View>
        <View style={Styles.successBanner}>
          {<Banner message={successMessage} />}
        </View>
        <View
          style={[
            Styles.screenContainer,
            (style = {
              height: "85%",
              alignItems: "center",
            }),
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              marginLeft: 0,
            }}
          >
            <View
              style={{
                width: "49.5%",
              }}
            >
              <SportsPicker
                style={[
                  Styles.sportsPickerDropdown,
                  (style = { overflow: "hidden", marginLeft: 0 }),
                ]}
                defaultValue=""
                placeholderTextColor="grey"
                sportsData={sportSpecificValues}
                onValueChange={handleSportChange}
                label="Sport"
                selectedSport={selectedSport}
              />
            </View>
            <View style={{ width: "49.5%" }}>
              <Picker
                style={[
                  Styles.sportsPickerDropdown,
                  (style = { overflow: "hidden", marginLeft: 0 }),
                ]}
                defaultValue=""
                placeholderTextColor="grey"
                onValueChange={handleGameTypeChange}
                language={gameTypeList}
                label="Game Type"
              />
            </View>
          </View>

          <Picker
            style={[Styles.sportsPickerDropdown, Styles.input]}
            defaultValue=""
            placeholderTextColor="grey"
            language={calibreList}
            onValueChange={handleCalibreChange}
            label="Calibre"
          />

          <Picker
            style={[Styles.sportsPickerDropdown, Styles.input]}
            defaultValue=""
            placeholderTextColor="grey"
            onValueChange={handleGenderChange}
            language={genderList}
            label="Gender"
          />
          <Picker
            style={[Styles.sportsPickerDropdown, Styles.input]}
            defaultValue=""
            placeholderTextColor="grey"
            onValueChange={handlePositionChange}
            language={positionList}
            label="Position"
          />
          {/* LOCATION SELECTOR */}
          <AutoCompletePicker
            onInputSelected={captureSelectedLocation}
            style={[Styles.sportsPickerDropdown, Styles.input]}
          />

          {/* DATE SELECTOR */}
          <DatePicker
            onInputSelected={captureSelectedDate}
            style={[Styles.datePickerButton, Styles.input]}
          />
          {/* TIME SELECTOR */}
          <TimePicker
            onInputSelected={captureSelectedTime}
            style={[Styles.datePickerButton, Styles.input]}
          />
          <Picker
            style={[Styles.sportsPickerDropdown, Styles.input]}
            placeholder="Game Length (minutes)"
            defaultValue=""
            placeholderTextColor="grey"
            onValueChange={handleGameLengthChange}
            language={gameLengthList}
            label="Game Length"
          />
          <TextInput
            style={[Styles.additionalInfo, Styles.input]}
            placeholder="Additional Info..."
            defaultValue=""
            placeholderTextColor="grey"
            onChangeText={(additionalInfo) => setAdditionalInfo(additionalInfo)}
          />
        </View>
        <View style={Styles.requestPlayerContainer}>
          <View style={Styles.requestPlayerButtonContainer}>
            <TouchableOpacity onPress={() => handleFormSubmit()}>
              <View style={Styles.requestPlayerButton}>
                <Text style={Styles.requestPlayerButtonText}>
                  Request a Player
                </Text>
                <Image
                  source={require("../../assets/circle-plus-solid.png")}
                  style={Styles.requestPlayerButtonImage}
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
    </ScrollView>
  );
}

export default HomeScreen;
