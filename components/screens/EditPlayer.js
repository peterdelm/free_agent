import {
  Button,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import React, { useEffect, useState, useRef, Component } from "react";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import Styles from "./Styles";
import Picker from "./Picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AutoCompletePicker from "./AutocompletePicker.js";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";

const EditPlayer = ({ navigation }) => {
  const [gender, setGender] = useState("");
  const [position, setPosition] = useState("");

  const [calibre, setCalibre] = useState("");
  const [location, setPlayerAddress] = useState("");
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
  const { playerId, playerSport } = route.params;
  const autoCompletePickerRef = useRef(null);

  const [game, setGame] = useState([]);
  console.log("PlayerId is " + playerId);
  console.log("PlayerSport is " + playerSport);

  const handleCalibreChange = (input) => {
    console.log("New Calibre is: ", input);
    setCalibre(input);
  };
  const handleGenderChange = (input) => {
    setGender(input);
  };
  const handlePositionChange = (input) => {
    setPosition(input);
  };
  const captureSelectedLocation = (input) => {
    console.log(input);
    setPlayerAddress(input);
  };
  const handleBioChange = (input) => {
    console.log("New Calibre is: ", input);
    setBio(input);
  };
  const handleTravelRangeChange = (input) => {
    setTravelRange(input);
  };

  const handleFormSubmit = () => {
    onSubmit();
  };

  ///////////////////////////////////////////////////////
  //retrieve the player values
  const fetchPlayerData = async () => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/players/${playerId}`;
    console.log("FetchplayerData called with url " + url);

    try {
      console.log("URL is " + url);

      const headers = {
        "Content-Type": "application/json",
      };

      const requestOptions = {
        headers,
      };

      const res = await authFetch(url, requestOptions);
      if (res.status === 200) {
        console.log("Status is", res.status);
      } else {
        throw new Error("Fetch Player Network response was not res.ok.");
      }

      setPlayer(res.body);
      console.log("Player location is " + player.location);
    } catch (error) {
      console.log("Error fetching player data:", error);
      // Handle error
    }
  };

  const fetchSportData = async () => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/sports`;

    try {
      console.log("Fetch Sport Data called with URL " + url);

      const headers = {
        "Content-Type": "application/json",
      };

      const requestOptions = {
        headers,
      };

      const res = await fetch(url, requestOptions);
      console.log("Sports Results are...");
      console.log(data);

      if (!res.ok) {
        throw new Error("Network response was not res.ok.");
      }

      const data = await res.json();
      console.log("Sports Results are...");
      console.log(data);

      const sportToFind = playerSport;
      console.log("PlayerSport is: " + playerSport);

      const foundSport = data.sports.find(
        (sport) => sport.sport === sportToFind
      );

      if (foundSport) {
        console.log("Found sport:", foundSport);
        setCalibreList(foundSport.calibre);
        setPositionList(foundSport.position);
      } else {
        console.log("Sport not found");
      }
    } catch (error) {
      console.log("Error making authenticated request:", error);
      // Handle error
      throw error;
    }
  };

  const fetchSportsandPlayers = async () => {
    console.log("Fetching Sports and Players");
    await fetchPlayerData().then;
    await fetchSportData();
  };
  //////////////////////////////////////////////////////
  //Retrieve the player and sport values
  useEffect(() => {
    console.log("EditPlayer useEffect scalled");

    const fetchData = async () => {
      try {
        await fetchSportsandPlayers();
      } catch (error) {
        console.error("Error fetching sports and players:", error);
      }
    };

    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await fetchSportsandPlayers();
        } catch (error) {
          console.error("Error fetching sports and players on focus:", error);
        }
      };

      fetchData();
    }, [])
  );

  const validateInputs = () => {
    if (!calibre) {
      console.log(calibre);

      console.log("No Calibre");
    }
  };

  const onSubmit = () => {
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
    console.log("EditPlayer submission is", body);

    const url = `${EXPO_PUBLIC_BASE_URL}api/players/${playerId}`;

    const postPlayer = async () => {
      try {
        console.log("URL is " + url);
        console.log("postPlayer async request called at line 138");

        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        };

        const res = await authFetch(url, requestOptions);
        console.log("res.body is ", res.body);
        if (res.body.success === true) {
          console.log("Submit successful");
          navigation.navigate("ViewPlayer", {
            playerId: playerId,
            refresh: true,
          });
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
          Edit Player Profile
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
          defaultValue={player.calibre}
          placeholderTextColor="grey"
          language={calibreList}
          onValueChange={handleCalibreChange}
          label={player.calibre}
        />
        <Picker
          style={[Styles.sportsPickerDropdown, Styles.input]}
          defaultValue={player.gender}
          placeholderText
          Color="#005F66"
          onValueChange={handleGenderChange}
          language={genders}
          label={player.gender}
        />
        <Picker
          style={[Styles.sportsPickerDropdown, Styles.input]}
          defaultValue={player.position}
          placeholderText
          Color="#005F66"
          onValueChange={handlePositionChange}
          language={positions}
          label={player.position}
        />
        <AutoCompletePicker
          onInputSelected={captureSelectedLocation}
          style={[Styles.sportsPickerDropdown, Styles.input]}
          ref={autoCompletePickerRef}
          value={player.location}
          placeholder={player.location}
          placeholderTextColor="#005F66"
        />
        {/* Make this a sliding scale and move it to a subsequent window */}
        <TextInput
          style={[
            Styles.sportsPickerDropdown,
            Styles.input,
            (style = { textAlign: "center" }),
          ]}
          placeholder={`Travel Range: ${player.travelRange} km`}
          defaultValue={`${player.travelRange}`}
          placeholderTextColor="#005F66"
          onChangeText={(travelRange) => handleTravelRangeChange(travelRange)}
          placeholderText={player.travelRange}
        />
        <TextInput
          style={[
            Styles.sportsPickerDropdown,
            Styles.input,
            (style = { textAlign: "center" }),
          ]}
          defaultValue={`${player.bio}`}
          placeholder={`${player.bio}`}
          placeholderTextColor="#005F66"
          onChangeText={(bio) => handleBioChange(bio)}
        />
        <TouchableOpacity>
          <Button title="SAVE PLAYER" onPress={() => handleFormSubmit()} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditPlayer;
