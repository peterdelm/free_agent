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
import { useNavigation, useRoute } from "@react-navigation/native";
import Styles from "./Styles";
import Picker from "./Picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

const EditPlayer = ({ navigation }) => {
  const [gender, setGender] = useState("");
  const [position, setPosition] = useState("");

  const [calibre, setCalibre] = useState("");
  const [gameType, setGameType] = useState("");
  const [location, setPlayerAddress] = useState("");
  const [date, setGameDate] = useState("");
  const [time, setGameTime] = useState("");
  const [game_length, setGameLength] = useState("");
  const [team_name, setTeamName] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState("");
  const [sportSpecificValues, setSportSpecificValues] = useState("");
  const [calibreList, setCalibreList] = useState([]);
  const [gameTypeList, setGameTypeList] = useState([]);
  const [genderList, setGenderList] = useState(["Any", "Male", "Female"]);
  const [selectedSport, setSelectedSport] = useState();
  const [travelRange, setTravelRange] = useState("");
  const [positionList, setPositionList] = useState([]);
  const [player, setPlayer] = useState({});

  const route = useRoute();
  const { playerId } = route.params;
  const { sportId } = route.params;

  const [game, setGame] = useState([]);
  console.log("PlayerId is " + playerId);

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

  const handleFormSubmit = () => {
    onSubmit();
  };

  ///////////////////////////////////////////////////////
  //retrieve the player values
  const fetchPlayerData = async () => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/players/" + playerId`;
    console.log("FetchplayerData called with url " + url);

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
          console.log(res);
          setPlayer(res);
          console.log("Player location is " + player.location);
        });
    } catch (error) {
      console.log("Error making authenticated request:", error);
      // Handle error
    }
  };

  //////////////////////////////////////////////////////
  //Retrieve the sport values
  useEffect(() => {
    console.log("EditPlayer useEffect called");

    const fetchSportData = async () => {
      const url = `${EXPO_PUBLIC_BASE_URL}api/sports/" + sportId`;

      try {
        const token = await getTokenFromStorage();
        console.log("Token is " + token);
        console.log("Fetch Sport Data called with URL " + url);

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
            console.log("Sports Results are...");
            console.log(res);
            setSportSpecificValues(res);
            setCalibreList(res.calibre);
            setPositionList(res.position);
          });
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchSportData();
    fetchPlayerData();
  }, []);

  const validateInputs = () => {
    if (!calibre) {
      console.log(calibre);

      console.log("No Calibre");
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
      location,
      bio,
      travelRange,
      sport: sport,
      position,
    };

    console.log("SavePlayer submit body.calibre is: " + body.position);
    const url = `${EXPO_PUBLIC_BASE_URL} + ${playerId}`;

    const postPlayer = async () => {
      try {
        const token = await getTokenFromStorage();
        console.log("Token is " + token);
        console.log("URL is " + url);
        console.log("postPlayer async request called at line 138");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const requestOptions = {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        };

        const res = await fetch(url, requestOptions);

        if (res.ok) {
          const data = await res.json();
          if (data.success === true) {
            console.log("Submit successful");
            navigation.navigate("ViewPlayer", { playerId: game.id });
          } else {
            console.log("Submit Failed");
          }
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    postPlayer();
  };

  var calibres = calibreList;
  var gameTypes = gameTypeList;
  var genders = genderList;
  var sport = selectedSport;
  var positions = positionList;
  console.log("Player is " + player);

  return (
    <View style={Styles.container}>
      <View style={Styles.inputView}>
        <Picker
          style={Styles.TextInput}
          defaultValue={player.calibre}
          placeholderTextColor="#005F66"
          language={calibres}
          onValueChange={handleCalibreChange}
          label={player.calibre}
        />
      </View>
      <View style={Styles.inputView}>
        <Picker
          style={Styles.TextInput}
          defaultValue={player.gender}
          placeholderText
          Color="#005F66"
          onValueChange={handleGenderChange}
          language={genders}
          label={player.gender}
        />
      </View>
      <View style={Styles.inputView}>
        <Picker
          style={Styles.TextInput}
          defaultValue={player.position}
          placeholderText
          Color="#005F66"
          onValueChange={handlePositionChange}
          language={positions}
          label={player.position}
        />
      </View>
      <View style={Styles.inputView}>
        {/* This will be a LOCATION SELECTOR */}
        <TextInput
          style={Styles.TextInput}
          placeholder={`${player.location}`}
          defaultValue={`${player.location}`}
          placeholderTextColor="#005F66"
          onChangeText={(location) => setPlayerAddress(location)}
          language={gameTypes}
          label={`${player.location}`}
        />
      </View>
      {/* Make this a sliding scale and move it to a subsequent window */}
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          placeholder={`Travel Range: ${player.travelRange} km`}
          defaultValue={player.travelRange}
          placeholderTextColor="#005F66"
          onChangeText={(travelRange) => setTravelRange(travelRange)}
          placeholderText={player.travelRange}
        />
      </View>
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.TextInput}
          defaultValue={`${player.bio}`}
          placeholder={`${player.bio}`}
          placeholderTextColor="#005F66"
          onChangeText={(bio) => setBio(bio)}
        />
      </View>
      <View>
        <TouchableOpacity>
          <Button title="SAVE PLAYER" onPress={() => handleFormSubmit()} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditPlayer;
