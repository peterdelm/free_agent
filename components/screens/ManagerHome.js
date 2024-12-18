import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Styles from "./Styles.js";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import SportsPicker from "./SportsPicker.js";
import Picker from "./Picker.js";
import GameTypePicker from "./GameTypePicker.js";
import DatePicker from "./DatePicker.js";
import TimePicker from "./TimePicker.js";
import NavigationFooter from "./NavigationFooter.js";
import getCurrentUser from "./getCurrentUser.helper.js";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import AddressInput from "./AddressInput.js";
import authFetch from "../../api/authCalls.js";
navigator.geolocation = require("react-native-geolocation-service");
import LoadingModal from "./LoadingModal.js";

function HomeScreen({ navigation, message }) {
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
  const [errorMessage, setErrorMessage] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [resetTrigger, setResetTrigger] = useState(false); // State to trigger reset
  const [isLoadingScreenVisible, setLoadingScreenVisible] = useState(false);

  const openLoadingScreen = () => setLoadingScreenVisible(true);

  const closeLoadingScreen = () => setLoadingScreenVisible(false);

  const autoCompletePickerRef = useRef(null);
  const timePickerRef = useRef(null);
  const datePickerRef = useRef(null);
  const pickerRef = useRef(null);

  const handleSportChange = (selectedSport) => {
    // Check if the selected item is the default placeholder
    if (selectedSport === undefined) {
      // Handle the case where the default value is selected
      setSelectedSport({});
      setCalibreList([]);
      setGameTypeList([]);
      setGameLengthList([]);
      setPositionList([]);
      setSelectedSportId(null);
    } else {
      console.log("selectedSport.calibre is", selectedSport.calibre);
      console.log("Calibre is", calibre);

      setSelectedSport(selectedSport);
      setCalibreList(selectedSport.calibre);
      setGameTypeList(selectedSport.gameType);
      setGameLengthList(selectedSport.gameLength);
      setPositionList(selectedSport.position);
      setSelectedSportId(selectedSport.id);
      handleCalibreChange("");
      console.log("Selected sport is:", selectedSport.sport);
      setDefaultValue("");
    }
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
    console.log("Handle Calibre Change called");
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
      setErrorMessage("");
      const user = fetchUser();
      console.log(user.currentRole);
      setCurrentUser();
    }, [])
  );

  //Retrieve the relevant values for the selected sport
  useEffect(() => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/sports`;

    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          headers,
        };

        authFetch(url, requestOptions)
          .then((res) => {
            if (res) {
              return res;
            } else throw new Error("Network response was not ok.");
          })
          .then((res) => {
            setSportSpecificValues(res.body.sports);
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  const validateInputs = () => {
    if (!location) {
      setErrorMessage("Location is Missing");
      return false;
    }
    if (!calibre) {
      setErrorMessage("Calibre is Missing");
      return false;
    }
    if (!gameType) {
      setErrorMessage("Game Type is Missing");
      return false;
    }
    if (!gender) {
      setErrorMessage("Gender is Missing");
      return false;
    }
    if (!position) {
      setErrorMessage("Position is Missing");
      return false;
    }
    if (!date) {
      setErrorMessage("Date is Missing");
      return false;
    }
    if (!time) {
      setErrorMessage("Time is Missing");
      return false;
    }
    if (!gameLength) {
      setErrorMessage("Game Length is Missing");
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async () => {
    const dateString = date.dateString;

    const validation = validateInputs();
    if (validation) {
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
      const url = `${EXPO_PUBLIC_BASE_URL}api/games`;

      console.log("Game Request Body is", body);
      openLoadingScreen();

      const postGame = async () => {
        try {
          console.log("URL is " + url);

          const headers = {
            "Content-Type": "application/json",
          };

          const requestOptions = {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          };

          await authFetch(url, requestOptions)
            .then((res) => {
              if (res) {
                console.log("res is", res);
                return res;
              }
              throw new Error("Network response was not ok.");
            })
            .then((data) => {
              if (data.status === 200) {
                if (data.body.success) {
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
                  setErrorMessage("");
                  if (autoCompletePickerRef.current) {
                    autoCompletePickerRef.current.resetPickerValues();
                  }

                  if (datePickerRef.current) {
                    datePickerRef.current.resetDatePickerValues();
                  }
                  // Trigger reset in Pickering component
                  setResetTrigger(true);

                  // Reset the trigger state immediately to allow further resets
                  setTimeout(() => setResetTrigger(false), 0);

                  closeLoadingScreen();
                  navigation.navigate("ManagerBrowseGames", {
                    successMessage:
                      "Game created successfully. Free Agent pending.",
                  });
                }
              } else {
                console.log("Submit Failed");
                setErrorMessage("Content Missing");
              }
            });
        } catch (error) {
          console.log("Error making authenticated request:", error);
        }
      };
      postGame();
    }
  };

  const handleFormSubmit = () => {
    onSubmit();
  };

  const handleLocationSelected = useCallback((data) => {
    console.log("Handle Location Selected has been Pressed!");
    console.log("Description is:", data);
    setGameAddress(data);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          flex: 0,
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
      <View
        style={{
          paddingLeft: 5,
          paddingRight: 5,
          flex: 1,
          alignItems: "center",
        }}
      >
        {/* LOCATION SELECTOR */}
        <AddressInput
          handleLocationSelected={handleLocationSelected}
          resetTrigger={resetTrigger}
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          listViewDisplayed={false}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={[
                (style = {
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
                      (style = {
                        overflow: "hidden",
                        marginLeft: 0,
                        height: Platform.OS === "ios" ? 50 : null, // Adjust height for iOS
                        flexDirection: Platform.OS === "ios" ? "row" : null,
                      }),
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
                  <GameTypePicker
                    style={[
                      Styles.gameTypePickerDropdown,
                      (style = {
                        overflow: "hidden",
                        marginLeft: 0,
                        borderColor: "black",
                        height: Platform.OS === "ios" ? 50 : null, // Adjust height for iOS
                      }),
                    ]}
                    defaultValue=""
                    placeholderTextColor="grey"
                    onValueChange={handleGameTypeChange}
                    language={gameTypeList}
                    label="Game Type"
                    resetTrigger={resetTrigger}
                  />
                </View>
              </View>
            </View>
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              placeholderTextColor="grey"
              language={calibreList}
              onValueChange={handleCalibreChange}
              label="Calibre"
              defaultValue={defaultValue}
              resetTrigger={resetTrigger}
            />
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              defaultValue=""
              placeholderTextColor="grey"
              onValueChange={handleGenderChange}
              language={genderList}
              label="Gender"
              ref={pickerRef}
              resetTrigger={resetTrigger}
            />
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              defaultValue=""
              placeholderTextColor="grey"
              onValueChange={handlePositionChange}
              language={positionList}
              label="Position"
              ref={pickerRef}
              resetTrigger={resetTrigger}
            />

            {/* DATE SELECTOR */}
            <DatePicker
              onInputSelected={captureSelectedDate}
              style={[Styles.datePickerButton, Styles.input]}
              ref={datePickerRef}
            />
            {/* TIME SELECTOR */}
            <TimePicker
              onInputSelected={captureSelectedTime}
              style={[Styles.datePickerButton, Styles.input]}
              ref={timePickerRef}
              resetTrigger={resetTrigger}
            />
            {/* GAME LENGTH */}
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              placeholder="Game Length"
              defaultValue="Game Length"
              placeholderTextColor="grey"
              onValueChange={handleGameLengthChange}
              language={gameLengthList}
              label="Game Length"
              ref={pickerRef}
              resetTrigger={resetTrigger}
              appendText="Minutes"
            />
            {/* Additional Info  */}
            <TextInput
              style={[Styles.additionalInfo, Styles.input]}
              placeholder="Additional Info... (Team Name, Cash Incentive)"
              defaultValue=""
              placeholderTextColor="grey"
              onChangeText={(additionalInfo) =>
                setAdditionalInfo(additionalInfo)
              }
            />
            <View style={Styles.requestPlayerContainer}>
              <View style={Styles.requestPlayerButtonContainer}>
                <TouchableOpacity onPress={() => handleFormSubmit()}>
                  {errorMessage ? (
                    <Text style={[Styles.errorText, { marginTop: 0 }]}>
                      {errorMessage}
                    </Text>
                  ) : null}
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

            <LoadingModal
              onClose={closeLoadingScreen}
              isLoading={isLoadingScreenVisible}
              loadingText="Posting Game..."
            />
          </View>
        </ScrollView>
      </View>

      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
}

export default HomeScreen;
