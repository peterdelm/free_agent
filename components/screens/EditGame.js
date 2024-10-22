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
import AddressInput from "./AddressInput.js";
import AutoCompletePicker from "./AutocompletePicker.js";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import DatePicker from "./DatePicker.js";
import TimePicker from "./TimePicker.js";
import authFetch from "../../api/authCalls.js";

const EditGame = ({ navigation }) => {
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
  const [game, setGame] = useState({});
  const [time, setGameTime] = useState("");
  const [date, setGameDate] = useState("");

  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);

  const route = useRoute();
  const { playerId, gameSport, gameId } = route.params;
  const autoCompletePickerRef = useRef(null);

  console.log("PlayerId is " + playerId);
  console.log("PlayerSport is " + gameSport);

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
  const fetchGameData = async () => {
    const url = `${EXPO_PUBLIC_BASE_URL}api/games/${gameId}`;

    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          headers,
        };

        const res = await authFetch(url, requestOptions);

        authFetch(url, requestOptions);
        if (res.status === 200) {
          console.log("GameView fetch res is", res.body);
          const gameData = res.body.game;
          setGame(gameData);
        } else console.log("Something in ViewGame fetch returned incorrectly");
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
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

      const sportToFind = gameSport;
      console.log("PlayerSport is: " + gameSport);

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

  const formattedDate = (isoDateString) => {
    const date = new Date(isoDateString);

    // Define options for the desired date format
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Format the date using options
    const formattedDate = date.toLocaleDateString(undefined, options); // Example: "August 13, 2024"
    console.log("Formatted date is:", formattedDate);
    return formattedDate;
  };

  const fetchSportsandGames = async () => {
    console.log("Fetching Sports and Players");
    await fetchGameData().then;
    await fetchSportData();
    console.log("Game date is", game.date);
  };
  //////////////////////////////////////////////////////
  //Retrieve the player and sport values
  useEffect(() => {
    console.log("EditPlayer useEffect scalled");

    const fetchData = async () => {
      try {
        await fetchSportsandGames();
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
          await fetchSportsandGames();
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

    const postGame = async () => {
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
    postGame();
  };
  const handleLocationSelected = (data, details) => {
    console.log("Handle Location Selected has been Pressed!");
    console.log("Description is:", data.description);
    setGameAddress(data.description);
  };

  const handleCancelButtonClick = () => {
    console.log("Handle Cancel Button Clicked!");
    navigation.goBack();
  };

  captureSelectedDate = (selectedInput) => {
    console.log("Selected Date input: " + selectedInput);
    setGameDate(selectedInput);
  };
  captureSelectedTime = (selectedInput) => {
    console.log("Selected Time input: " + selectedInput);
    setGameTime(selectedInput);
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
          Edit Game
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
        {/* LOCATION SELECTOR */}
        <AddressInput
          handleLocationSelected={handleLocationSelected}
          defaultLocation={game.location}
        />
        {/* DATE SELECTOR */}
        <DatePicker
          onInputSelected={captureSelectedDate}
          style={[Styles.datePickerButton, Styles.input]}
          ref={datePickerRef}
          input={game.date}
        />
        {/* TIME SELECTOR */}
        <TimePicker
          onInputSelected={captureSelectedTime}
          style={[Styles.datePickerButton, Styles.input]}
          ref={timePickerRef}
          defaultValue={game.time}
          inputValue={game.time}
        />
        <Picker
          style={[Styles.sportsPickerDropdown, Styles.input]}
          defaultValue={game.calibre}
          placeholderTextColor="grey"
          language={calibreList}
          onValueChange={handleCalibreChange}
          label={game.calibre}
        />
        <Picker
          style={[Styles.sportsPickerDropdown, Styles.input]}
          defaultValue={game.gender}
          placeholderText
          Color="#005F66"
          onValueChange={handleGenderChange}
          language={genders}
          label={game.gender}
        />
        {/* POSITION */}
        <Picker
          style={[Styles.sportsPickerDropdown, Styles.input]}
          defaultValue={game.position}
          placeholderText
          Color="#005F66"
          onValueChange={handlePositionChange}
          language={positions}
          label={game.position}
        />
        {/* GAME TYPE */}
        <Picker
          style={[Styles.sportsPickerDropdown, Styles.input]}
          defaultValue={game.gameType}
          placeholderText
          Color="#005F66"
          onValueChange={handlePositionChange}
          language={positions}
          label={game.gameType}
        />
        {/* GAME LENGTH */}
        <Picker
          style={[Styles.sportsPickerDropdown, Styles.input]}
          defaultValue={game.gameLength}
          placeholderText
          Color="#005F66"
          onValueChange={handlePositionChange}
          language={positions}
          label={game.gameLength}
        />

        {/* BIO */}
        <TextInput
          style={[
            Styles.sportsPickerDropdown,
            Styles.input,
            (style = { textAlign: "center" }),
          ]}
          defaultValue={`${game.additionalInfo}`}
          placeholder={"Additional Info..."}
          placeholderTextColor="#005F66"
          onChangeText={(bio) => handleBioChange(bio)}
        />
        <TouchableOpacity>
          <Button
            title=" *INACTIVE* SAVE GAME *INACTIVE*"
            onPress={() => handleFormSubmit()}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button title="CANCEL" onPress={() => handleCancelButtonClick()} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditGame;
