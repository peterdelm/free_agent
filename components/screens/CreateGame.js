import { StatusBar } from "expo-status-bar";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef, Component } from "react";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";
import Picker from "./Picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateGame = ({ navigation }) => {
  const [gender, setGender] = useState("");
  const [calibre, setCalibre] = useState("");
  const [game_type, setGameType] = useState("");
  const [location, setGameAddress] = useState("");
  const [date, setGameDate] = useState("");
  const [time, setGameTime] = useState("");
  const [game_length, setGameLength] = useState("");
  const [team_name, setTeamName] = useState("");
  const [additional_info, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState("");
  const [sportSpecificValues, setSportSpecificValues] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [calibreList, setCalibreList] = useState([]);
  const [gameTypeList, setGameTypeList] = useState([]);
  const [genderList, setGenderList] = useState(["Any", "Male", "Female"]);
  const [gameLengthList, setGameLengthList] = useState([]);
  const [isSportSelected, setIsSportSelected] = useState(false);
  const [selectedSport, setSelectedSport] = useState();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games";

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

  const handleFormSubmit = () => {
    onSubmit();
    //if onSubmit returns successfully:
    //return to HomeScreen
    //Display 'Game Created' notification
  };

  const handleAddressChange = (input) => {
    setQuery(input);
  };

  const fetchAutocompleteSuggestons = async (addressFragment) => {
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/geocoding";

    try {
      const response = await fetch(
        `YOUR_BACKEND_API_URL?addressFragment=${text}`
      );
    } catch {}
  };

  //Retrieve the relevant values for the selected sport
  useEffect(() => {
    console.log("CreateGame useEffect called");

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
              console.log("res was ok");
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
      game_type,
      date,
      location,
      time,
      game_length,
      team_name,
      additional_info,
      is_active: true,
    };

    console.log(body);
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

  if (isSportSelected === true) {
    console.log("sportSelected is " + isSportSelected);
    console.log("selectedSport is " + selectedSport);
    var calibres = calibreList;
    var gameTypes = gameTypeList;
    var genders = genderList;
    var gameLengths = gameLengthList;

    return (
      <View style={Styles.container}>
        <View style={Styles.inputView}>
          <Picker
            style={Styles.TextInput}
            defaultValue=""
            placeholderTextColor="#005F66"
            language={calibres}
            onValueChange={handleCalibreChange}
            label="Calibre"
          />
        </View>

        <View style={Styles.inputView}>
          <Picker
            style={Styles.TextInput}
            placeholder="Game Type"
            defaultValue=""
            placeholderTextColor="#005F66"
            onValueChange={handleGameTypeChange}
            language={gameTypes}
            label="Game Type"
          />
        </View>
        <View style={Styles.inputView}>
          <Picker
            style={Styles.TextInput}
            defaultValue=""
            placeholderText
            Color="#005F66"
            onValueChange={handleGenderChange}
            language={genders}
            label="Gender"
          />
        </View>
        <View style={Styles.inputView}>
          {/* This will be a LOCATION SELECTOR */}
          <TextInput
            style={Styles.TextInput}
            placeholder="Location"
            defaultValue=""
            placeholderTextColor="#005F66"
            onChangeText={(location) => setGameAddress(location)}
            language={gameTypes}
            label="Location"
          />
        </View>
        <View style={Styles.inputView}>
          {/* This will be a DATE SELECTOR */}
          <TextInput
            style={Styles.TextInput}
            placeholder="Date"
            defaultValue=""
            placeholderTextColor="#005F66"
            onChangeText={(date) => setGameDate(date)}
            language={gameTypes}
            label="Date"
          />
        </View>
        <View style={Styles.inputView}>
          {/* This will be a TIME SELECTOR */}
          <TextInput
            style={Styles.TextInput}
            placeholder="Time"
            defaultValue=""
            placeholderTextColor="#005F66"
            onChangeText={(time) => setGameTime(time)}
            label="Time"
          />
        </View>
        <View style={Styles.inputView}>
          <Picker
            style={Styles.TextInput}
            placeholder="Game Length (minutes)"
            defaultValue=""
            placeholderTextColor="#005F66"
            onValueChange={handleGameLengthChange}
            language={gameLengths}
            label="Game Length"
          />
        </View>
        <View style={Styles.inputView}>
          <TextInput
            style={Styles.TextInput}
            placeholder="Additional Info"
            defaultValue=""
            placeholderTextColor="#005F66"
            onChangeText={(additional_info) =>
              setAdditionalInfo(additional_info)
            }
          />
        </View>
        <View>
          <TouchableOpacity>
            <Button title="CREATE GAME" onPress={() => handleFormSubmit()} />
          </TouchableOpacity>
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
            setSelectedSport(sport.sport);
            setCalibreList(sport.calibre);
            setGameTypeList(sport.game_type);
            setGameLengthList(sport.game_length);
            if (sport.gender !== null) {
              setGenderList(sport.gender);
            }
          }}
        >
          <Text key={index} style={Styles.primaryButton}>
            {sport.sport}
          </Text>
        </TouchableOpacity>
      ));
      console.log("sportSpecificValues are " + sportSpecificValues[0].sport);
    }
    return (
      <View style={Styles.container}>
        <View style={Styles.homeContainer}>
          <ScrollView>
            {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default CreateGame;
