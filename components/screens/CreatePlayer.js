import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef, Component } from "react";
import Styles from "./Styles";
import Picker from "./Picker";
import AutoCompletePicker from "./AutocompletePicker.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import AddressInput from "./AddressInput.js";
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

  const [errorMessage, setErrorMessage] = useState("");

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

  const handleLocationSelected = (data, details) => {
    console.log("Handle Location Selected has been Pressed!");
    console.log("Description is:", data.description);
    setPlayerAddress(data.description);
  };

  const handleFormSubmit = () => {
    onSubmit();
    //if onSubmit returns successfully:
    //return to HomeScreen
    //Display 'Game Created' notification
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
        // Handle error
      }
    };
    fetchData();
  }, []);

  // const handleError = (errror, input) => {
  //   setErrors((prevState) => ({ ...prevState, [input]: error }));
  // };

  const validateInputs = () => {
    if (!calibre) {
      console.log(calibre);

      console.log("No Calibre");
      // handleError("Please input calibre", "calibre");
    }
  };

  const onSubmit = () => {
    console.log(calibre);

    validateInputs();
    const body = {
      gender,
      calibre,
      location,
      additionalInfo,
      position,
      location,
      travelRange,
      sport: sport,
      sportId: sportId,
    };

    console.log("CreatePlayer OnSubmit body is " + body.calibre);
    const url = `${EXPO_PUBLIC_BASE_URL}api/players`;

    const postPlayer = async () => {
      try {
        console.log("URL is " + url);
        console.log("postPlayer async request called");

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
            if (res.ok) {
              return res.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            if (data.success === true) {
              console.log("Submit successful");
              navigation.navigate("ManagerHome", {
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
  };

  if (isSportSelected === true) {
    console.log("sportSelected is " + isSportSelected);
    console.log("selectedSport is " + selectedSport);
    var calibres = calibreList;
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
            language={calibreList}
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

          {/* Make this a sliding scale and move it to a subsequent window */}
          <TextInput
            style={[
              Styles.sportsPickerDropdown,
              Styles.input,
              (styles = { textAlign: "center" }),
            ]}
            placeholder="Travel Range (km)"
            defaultValue=""
            placeholderTextColor="#005F66"
            onChangeText={handleTravelRangeChange}
          />
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
              <Text style={[Styles.errorText, { marginTop: 0 }]}>
                {errorMessage}
              </Text>
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
      allActiveGames = sportSpecificValues.map((sport, index) => (
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
              (style = {
                fontSize: 35,
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
      </View>
    );
  }
};

const sketchstyles = StyleSheet.create({
  autocompleteContainer: {
    width: "100%",
    height: 50, // Adjust this based on your needs
    position: "absolute",
    top: 0, // Adjust as needed
    zIndex: 1000, // Ensure it's above other components
  },
});

export default CreatePlayer;
