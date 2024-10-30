import {
  Button,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef, Component } from "react";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import Styles from "./Styles";
import Picker from "./Picker";
import AddressInput from "./AddressInput.js";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import DatePicker from "./DatePicker.js";
import TimePicker from "./TimePicker.js";
import authFetch from "../../api/authCalls.js";
import DeleteGamePopup from "./DeleteGamePopup.js";
import { deleteGameRequest } from "../../api/apiCalls.js";

const EditGame = ({ navigation }) => {
  const [location, setGameAddress] = useState("");
  const [calibreList, setCalibreList] = useState([]);
  const [gameTypeList, setGameTypeList] = useState([]);
  const [genderList, setGenderList] = useState(["Any", "Male", "Female"]);
  const [selectedSport, setSelectedSport] = useState();
  const [positionList, setPositionList] = useState([]);
  const [gameLengthsList, setGameLengthsList] = useState([]);

  const [player, setPlayer] = useState({});
  const [game, setGame] = useState({});
  const [time, setTime] = useState("");
  const [date, setGameDate] = useState("");
  const [calibre, setCalibre] = useState("");
  const [gender, setGender] = useState("");
  const [position, setPosition] = useState("");
  const [gameType, setGameType] = useState("");
  const [gameLength, setGameLength] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false); // State to track deletion status
  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);
  const { height } = Dimensions.get("window");
  const inputHeight = height * 0.07;

  const route = useRoute();
  const { playerId, gameSport, gameId } = route.params;
  const autoCompletePickerRef = useRef(null);

  const handleCalibreChange = (input) => {
    setCalibre(input);
  };

  const handleGameTypeChange = (input) => {
    setGameType(input);
  };
  const handleGameLengthChange = (input) => {
    setGameLength(input);
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
        setGameLengthsList(foundSport.gameLength);
        setGameTypeList(foundSport.gameType);
      } else {
        console.log("Sport not found");
      }
    } catch (error) {
      console.log("Error making authenticated request:", error);
      // Handle error
      throw error;
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setInputFocused(false); // Reset focus state when keyboard hides
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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

  // Function to open the modal
  const openModal = () => setIsModalVisible(true);

  // Function to close the modal
  const closeModal = () => setIsModalVisible(false);

  const onSubmit = () => {
    validateInputs();
    const body = {
      location,
      date,
      time,
      calibre,
      gender,
      position,
      gameType,
      gameLength,
      additionalInfo,
      sport: sport,
    };
    console.log("EditPlayer submission is", body);

    const url = `${EXPO_PUBLIC_BASE_URL}api/games/${gameId}`;

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
          navigation.navigate("ViewGame", {
            gameId: gameId,
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
  const handleDeleteGameButtonPress = async () => {
    console.log("handleDeleteGameButtonPress pressed");

    try {
      const response = await deleteGameRequest(gameId);
      console.log("response is", response);

      if (response.status === 200) {
        console.log("Game deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting Game:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  captureSelectedDate = (selectedInput) => {
    console.log("Selected Date input: " + selectedInput);
    setGameDate(selectedInput);
  };
  captureSelectedTime = (selectedInput) => {
    console.log("Selected Time input: " + selectedInput);
    setTime(selectedInput);
  };
  handleInfoSaveClick = () => {
    setInputFocused(false);
  };

  var calibres = calibreList;
  var gameTypes = gameTypeList;
  var genders = genderList;
  var sport = selectedSport;
  var positions = positionList;
  var gameLengths = gameLengthsList;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        <View
          style={[
            Styles.screenHeader,
            (style = { justifyContent: "space-between" }),
          ]}
        >
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
          <View style={{ paddingRight: 20 }}>
            <TouchableOpacity onPress={() => openModal()}>
              <Image
                source={require("../../assets/trash-can.png")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
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
          {!isKeyboardVisible && (
            <AddressInput
              handleLocationSelected={handleLocationSelected}
              defaultLocation={game.location}
            />
          )}
          {/* DATE SELECTOR */}
          {!isKeyboardVisible && (
            <DatePicker
              onInputSelected={captureSelectedDate}
              style={[Styles.datePickerButton, Styles.input]}
              ref={datePickerRef}
              input={game.date}
            />
          )}
          {/* TIME SELECTOR */}
          {!isKeyboardVisible && (
            <TimePicker
              onInputSelected={captureSelectedTime}
              style={[Styles.datePickerButton, Styles.input]}
              ref={timePickerRef}
              defaultValue={game.time}
              inputValue={game.time}
            />
          )}
          {!isKeyboardVisible && (
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              defaultValue={game.calibre}
              placeholderTextColor="grey"
              language={calibres}
              onValueChange={handleCalibreChange}
              label={game.calibre}
            />
          )}
          {!isKeyboardVisible && (
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              defaultValue={game.gender}
              placeholderText
              Color="#005F66"
              onValueChange={handleGenderChange}
              language={genders}
              label={game.gender}
            />
          )}
          {/* POSITION */}
          {!isKeyboardVisible && (
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              defaultValue={game.position}
              placeholderText
              Color="#005F66"
              onValueChange={handlePositionChange}
              language={positions}
              label={game.position}
            />
          )}
          {/* GAME TYPE */}
          {!isKeyboardVisible && (
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              defaultValue={game.gameType}
              placeholderText
              Color="#005F66"
              onValueChange={handleGameTypeChange}
              language={gameTypes}
              label={game.gameType}
            />
          )}
          {/* GAME LENGTH */}
          {!isKeyboardVisible && (
            <Picker
              style={[Styles.sportsPickerDropdown, Styles.input]}
              defaultValue={game.gameLength}
              placeholderText
              Color="#005F66"
              onValueChange={handleGameLengthChange}
              language={gameLengths}
              label={game.gameLength}
            />
          )}
          {/* Additional Info input */}
          <View
            style={[
              {
                flex: isKeyboardVisible ? 2 : 0,
                height: isKeyboardVisible ? "100%" : 100,
                paddingBottom: isKeyboardVisible ? 100 : 0,
              },
            ]}
          >
            <View
              style={[
                isKeyboardVisible
                  ? {
                      borderWidth: 2,
                      borderColor: "red",
                      flex: isKeyboardVisible ? 2 : 0,
                      borderWidth: 2,
                      borderColor: "#154734",
                      flex: 2,
                      backgroundColor: "#FFFFFF",
                    }
                  : {
                      height: Platform.select({
                        ios: inputHeight,
                        android: inputHeight,
                      }),
                      borderColor: "#154734",
                      borderRadius: 5,
                      borderWidth: 1,
                      overflow: "hidden",
                      justifyContent: "center",
                      flex: 0,
                      backgroundColor: "#FFFFFF",
                    },
              ]}
            >
              <TextInput
                style={[
                  isKeyboardVisible
                    ? { padding: 10 }
                    : {
                        textAlign: "center",
                      },
                ]}
                placeholder="Additional Info... (Team Name, Dress Code, etc...)"
                onChangeText={setAdditionalInfo}
                value={additionalInfo || game.additionalInfo}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </View>
          </View>
          {!isKeyboardVisible && (
            <TouchableOpacity>
              <Button title="SAVE GAME" onPress={() => handleFormSubmit()} />
            </TouchableOpacity>
          )}
          {!isKeyboardVisible && (
            <TouchableOpacity>
              <Button
                title="CANCEL"
                onPress={() => handleCancelButtonClick()}
              />
            </TouchableOpacity>
          )}
        </View>
        <DeleteGamePopup
          isModalVisible={isModalVisible}
          handleButtonPress={handleDeleteGameButtonPress}
          onClose={closeModal}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditGame;
