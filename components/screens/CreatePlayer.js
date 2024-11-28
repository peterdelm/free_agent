import {
  Button,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Styles from "./Styles";
import Picker from "./Picker";
import AutoCompletePicker from "./AutocompletePicker.js";
import NavigationFooter from "./NavigationFooter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import AddressInput from "./AddressInput.js";
import getCurrentUser from "./getCurrentUser.helper.js";
import authFetch from "../../api/authCalls.js";

const CreatePlayer = ({ navigation }) => {
  const [gender, setGender] = useState("");
  const [position, setPosition] = useState("");

  const [calibre, setCalibre] = useState("");
  const [gameType, setGameType] = useState("");
  const [location, setPlayerAddress] = useState("");
  const [date, setGameDate] = useState("");
  const [time, setGameTime] = useState("");
  const [game_length, setGameLength] = useState("");
  const [teamName, setTeamName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState("");
  const [sportSpecificValues, setSportSpecificValues] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [calibreList, setCalibreList] = useState([]);
  const [gameTypeList, setGameTypeList] = useState([]);
  const [genderList, setGenderList] = useState(["Any", "Male", "Female"]);

  const [gameLengthList, setGameLengthList] = useState([]);
  const [isSportSelected, setIsSportSelected] = useState(false);
  const [selectedSport, setSelectedSport] = useState();
  const [selectedSportId, setSelectedSportId] = useState("");
  const [travelRange, setTravelRange] = useState("");
  const [positionList, setPositionList] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [usersPlayerRoster, setUsersPlayerRoster] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [sliderValue, setSliderValue] = useState(0);

  const autoCompletePickerRef = useRef(null);

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

  const url = `${EXPO_PUBLIC_BASE_URL}api/games`;

  const handleCalibreChange = (input) => {
    setCalibre(input);
  };
  const handleGenderChange = (input) => {
    setGender(input);
  };
  const handlePositionChange = (input) => {
    setPosition(input);
  };
  const handleTravelRangeChange = (input) => {
    setTravelRange(input);
  };

  const handleLocationSelected = useCallback((data) => {
    console.log("Handle Location Selected has been Pressed!");
    console.log("Description is:", data);
    setPlayerAddress(data);
  }, []);
  const handleFormSubmit = () => {
    onSubmit();
  };

  //Retrieve the relevant values for the selected sport
  useEffect(() => {
    console.log("CreatePlayer useEffect called");

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
              console.log("res was ok");
              return res.json();
            } else throw new Error("Network response was not ok.");
          })
          .then((res) => {
            setSportSpecificValues(res.sports);
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
      }
    };

    const fetchUsersPlayerRoster = async () => {
      const url = `${EXPO_PUBLIC_BASE_URL}api/players/playerRoster`;

      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          headers,
        };

        await authFetch(url, requestOptions)
          .then((res) => {
            console.log("Res in fetchPlayers is", res.body.players);
            if (res.body.success) {
              console.log("res was ok");

              return res;
            } else throw new Error("Network response was not ok.");
          })
          .then((res) => setUsersPlayerRoster(res.body.players))
          .catch((error) => {
            console.log("Error during fetch:", error);
            // Handle specific error scenarios
          });
      } catch {
        console.log("error in fetch player roster");
      }
    };
    fetchUsersPlayerRoster();

    fetchData();
  }, []);

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

  const validateInputs = () => {
    if (!calibre) {
      setErrorMessage("Please Select a Calibre");
      return false;
    }
    if (!gender) {
      setErrorMessage("Please Select a Gender");
      return false;
    }
    if (!position) {
      setErrorMessage("Please Select a Position");
      return false;
    }
    if (!location) {
      setErrorMessage("Please Select a Location");
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = () => {
    console.log(calibre);

    const validation = validateInputs();
    if (validation) {
      const body = {
        gender,
        calibre,
        location,
        additionalInfo,
        position,
        location,
        travelRange: formatSliderValue(sliderValue),
        sport: sport,
        sportId: sportId,
      };

      console.log("CreatePlayer travelRange body is " + body.travelRange);
      const url = `${EXPO_PUBLIC_BASE_URL}api/players`;

      const postPlayer = async () => {
        try {
          console.log("postPlayer async request called");

          const headers = {
            "Content-Type": "application/json",
          };

          const requestOptions = {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          };

          await authFetch(url, requestOptions).then((res) => {
            if (res.status === 200) {
              console.log("Submit successful");
              navigation.navigate("ManagePlayers", {
                successMessage:
                  "Player created successfully. Free Agent pending.",
              });
            } else {
              setErrorMessage(
                "There was a problem creating your player profile. Please try again later."
              );

              console.log("Submit Failed");
            }
          });
        } catch (error) {
          setErrorMessage(
            "There was a problem creating your player profile. Please try again later."
          );
          console.log("Error making authenticated request:", error);
          // Handle error
        }
      };
      postPlayer();
    }
  };

  const formatSliderValue = (sliderValue) => {
    const formattedSliderValue = Math.round(sliderValue * 4) / 4;
    return formattedSliderValue;
  };

  if (isSportSelected === true) {
    // console.log("sportSelected is " + isSportSelected);
    // console.log("selectedSport is " + selectedSport);
    var calibres = calibreList;
    const filteredCalibreList = calibreList.filter((value) => value != "Any");
    var gameTypes = gameTypeList;
    var genders = genderList;
    var sport = selectedSport;
    var sportId = selectedSportId;
    var positions = positionList;

    return (
      <View style={{ flex: 1 }}>
        <View style={Styles.screenHeader}>
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
            New Player Profile
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <Picker
            style={[Styles.sportsPickerDropdown, Styles.input]}
            defaultValue=""
            placeholderTextColor="grey"
            language={filteredCalibreList}
            onValueChange={handleCalibreChange}
            label="Calibre"
          />
          <Picker
            style={[Styles.sportsPickerDropdown, Styles.input]}
            defaultValue=""
            placeholderText
            Color="#005F66"
            onValueChange={handleGenderChange}
            language={genders}
            label="Gender"
          />
          <Picker
            style={[Styles.sportsPickerDropdown, Styles.input]}
            defaultValue=""
            placeholderText
            Color="#005F66"
            onValueChange={handlePositionChange}
            language={positions}
            label="Position"
          />
          {/* This will be a LOCATION SELECTOR */}
          <AddressInput handleLocationSelected={handleLocationSelected} />

          {/* Sliding Scale */}
          <View
            style={{
              width: "100%",
              height: 100,
              borderWidth: 1,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              backgroundColor: "white",
            }}
          >
            <View>
              <Text>Travel Range</Text>
            </View>
            <View>
              <Text>{formatSliderValue(sliderValue)} km</Text>
            </View>
            <Slider
              style={{ width: "100%", border: 2, paddingTop: 10 }}
              minimumValue={0.25}
              maximumValue={35}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
              value={sliderValue}
              onValueChange={setSliderValue} // Update state as the value changes
            />
          </View>
          <TextInput
            style={[
              Styles.sportsPickerDropdown,
              Styles.input,
              (styles = { textAlign: "center" }),
            ]}
            placeholder="Optional Bio"
            defaultValue=""
            placeholderTextColor="#005F66"
            onChangeText={(additionalInfo) => setAdditionalInfo(additionalInfo)}
          />
          <View>
            {errorMessage ? (
              <View style={{ padding: 30 }}>
                <Text style={[Styles.errorText, { marginTop: 0 }]}>
                  {errorMessage}
                </Text>
              </View>
            ) : null}
            <TouchableOpacity>
              <Button
                title="CREATE PLAYER"
                onPress={() => handleFormSubmit()}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  } else {
    let allActiveGames = []; // Initialize as null initially
    const noActiveGames = <Text>...</Text>;

    if (sportSpecificValues.length > 0) {
      const activeSports = usersPlayerRoster.map((profile) => profile.sport);
      const uniqueSports = [...new Set(activeSports)];
      const filteredSportOptions = sportSpecificValues.filter(
        (item) => !uniqueSports.includes(item.sport)
      );
      console.log("filteredSportOptions are", filteredSportOptions);

      allActiveGames = filteredSportOptions.map((sport, index) => (
        <TouchableOpacity
          key={sport.id}
          onPress={() => {
            setIsSportSelected(true);
            setSelectedSportId(sport.id);
            setSelectedSport(sport.sport);
            setCalibreList(sport.calibre);
            setPositionList(sport.position);
            setGameTypeList(sport.gameType);
            setGameLengthList(sport.gameLength);
            if (sport.gender !== null) {
              setGenderList(sport.gender);
            }
          }}
          style={{ padding: 10 }}
        >
          <Text
            key={index}
            style={[
              Styles.input,
              Styles.align,
              (style = {
                fontSize: 30,
                textAlign: "center",
                textAlignVertical: "center",
                lineHeight: Platform.select({
                  ios: 50,
                }),
              }),
            ]}
          >
            {sport.sport}
          </Text>
        </TouchableOpacity>
      ));
      console.log("sportSpecificValues are " + sportSpecificValues[0].sport);
    }
    return (
      <View
        style={{
          height: "100%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 2,
            borderBottomStyle: "solid",
            flex: 0,
          }}
        >
          <View style={Styles.screenHeader}>
            <Text style={{ fontSize: 35, padding: 20 }}>Select a Sport</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "96%",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <ScrollView style={{ flex: 1 }}>
            {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
          </ScrollView>
        </View>
        <NavigationFooter />
      </View>
    );
  }
};

export default CreatePlayer;
