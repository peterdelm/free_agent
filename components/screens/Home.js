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
  const [isSportSelected, setIsSportSelected] = useState(false);
  const [selectedSportId, setSelectedSportId] = useState();
  const [position, setPosition] = useState("");
  const [positionList, setPositionList] = useState([]);
  const [currentUser, setCurrentUser] = useState("manager");

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

      const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games/active";
      console.log("UsefocusEffect Fetch games called");
    }, [])
  );

  //Retrieve the relevant values for the selected sport
  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/sports";

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

    const dateString = date.dateString;

    validateInputs();
    const body = {
      gender,
      calibre,
      position,
      gameType,
      date: dateString,
      location: "123 Jasper Street",
      time,
      gameLength,
      teamName,
      additionalInfo,
      isActive: true,
      sport: selectedSport.sport,
      sportId: selectedSportId,
    };

    console.log("Body values:");
    Object.keys(body).forEach((key) => {
      console.log(`${key}: ${body[key]}`);
    });

    console.log("CreateGame Request date is: " + body);
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
        <Text style={Styles.primaryButton}>{result}</Text>
      </View>
    );
  }

  return (
    <View style={Styles.homeScreenContainer}>
      {<Banner message={successMessage} />}
      <View
        style={[
          Styles.screenContainer,
          {
            borderBottomColor: "black",
            borderBottomWidth: 2,
            borderBottomStyle: "solid",
          },
        ]}
      >
        <View style={Styles.screenHeader}>
          <Image
            source={require("../../assets/prayingHands.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 35, padding: 20 }}>Request a Player</Text>
        </View>
      </View>
      <ScrollView style={{ width: "100%" }}>
        <View style={Styles.screenContainer}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
            }}
          >
            <View
              style={[Styles.sportsPickerDropdownContainer, { width: "50%" }]}
            >
              <SportsPicker
                style={Styles.TextInput}
                defaultValue=""
                placeholderTextColor="grey"
                sportsData={sportSpecificValues}
                onValueChange={handleSportChange}
                label="Sport"
                selectedSport={selectedSport}
              />
            </View>
            <View
              style={[Styles.sportsPickerDropdownContainer, { width: "50%" }]}
            >
              <Picker
                style={Styles.sportsPickerDropdown}
                defaultValue=""
                placeholderTextColor="grey"
                onValueChange={handleGameTypeChange}
                language={gameTypeList}
                label="Game Type"
              />
            </View>
          </View>
          <View style={Styles.sportsPickerDropdownContainer}>
            <Picker
              style={Styles.sportsPickerDropdown}
              defaultValue=""
              placeholderTextColor="grey"
              language={calibreList}
              onValueChange={handleCalibreChange}
              label="Calibre"
            />
          </View>

          <View style={Styles.sportsPickerDropdownContainer}>
            <Picker
              style={Styles.sportsPickerDropdown}
              defaultValue=""
              placeholderTextColor="grey"
              onValueChange={handleGenderChange}
              language={genderList}
              label="Gender"
            />
          </View>
          <View style={Styles.sportsPickerDropdownContainer}>
            <Picker
              style={Styles.sportsPickerDropdown}
              defaultValue=""
              placeholderTextColor="grey"
              onValueChange={handlePositionChange}
              language={positionList}
              label="Position"
            />
          </View>
          <View style={Styles.sportsPickerDropdownContainer}>
            {/* LOCATION SELECTOR */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text>Location Input Stand-in Until Credit card Renewal</Text>

              {/* <AutoCompletePicker
                onInputSelected={captureSelectedLocation}
                style={Styles.sportsPickerDropdown}
              /> */}
            </View>
          </View>

          <View style={Styles.sportsPickerDropdownContainer}>
            {/* DATE SELECTOR */}
            <DatePicker
              onInputSelected={captureSelectedDate}
              style={Styles.datePickerButton}
            />
          </View>
          <View style={Styles.sportsPickerDropdownContainer}>
            {/* TIME SELECTOR */}
            <TimePicker
              onInputSelected={captureSelectedTime}
              style={Styles.datePickerButton}
            />
          </View>
          <View style={Styles.sportsPickerDropdownContainer}>
            <Picker
              style={Styles.sportsPickerDropdown}
              placeholder="Game Length (minutes)"
              defaultValue=""
              placeholderTextColor="grey"
              onValueChange={handleGameLengthChange}
              language={gameLengthList}
              label="Game Length"
            />
          </View>
          <View style={Styles.sportsPickerDropdownContainer}>
            <TextInput
              style={Styles.additionalInfo}
              placeholder="Additional Info..."
              defaultValue=""
              placeholderTextColor="grey"
              onChangeText={(additionalInfo) =>
                setAdditionalInfo(additionalInfo)
              }
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
        </View>
      </ScrollView>
      <NavigationFooter
        currentRole={currentUser.currentRole}
        navigation={navigation}
      >
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
}

export default HomeScreen;
