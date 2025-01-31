import {
  Button,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Keyboard,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import Styles from "./Styles";
import Picker from "./Picker";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";
import Slider from "@react-native-community/slider";
import AddressInput from "./AddressInput.js";

const EditPlayer = ({ navigation }) => {
  const [gender, setGender] = useState("");
  const [position, setPosition] = useState("");
  const [calibre, setCalibre] = useState("");
  const [location, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [calibreList, setCalibreList] = useState([]);
  const [gameTypeList, setGameTypeList] = useState([]);
  const [genderList, setGenderList] = useState(["Any", "Male", "Female"]);
  const [selectedSport, setSelectedSport] = useState();
  const [positionList, setPositionList] = useState([]);
  const [player, setPlayer] = useState({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isBioInputFocused, setIsBioInputFocused] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { height } = Dimensions.get("window");
  const inputHeight = height * 0.07;

  const route = useRoute();
  const { playerId, playerSport } = route.params;

  const [game, setGame] = useState([]);
  console.log("PlayerId is " + playerId);
  console.log("PlayerSport is " + playerSport);

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
        if (isBioInputFocused) {
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleAddressInputFocus = () => {
    setIsAddressInputClicked((prev) => !prev);
    console.log("Address input clicked! Toggled state.");
  };

  const handleBioInputFocus = () => {
    setIsBioInputFocused((prev) => !prev);
    console.log("Address input clicked! Toggled state.");
    setIsInputFocused((prev) => !prev);
  };

  const handleCancelButtonClick = () => {
    console.log("Handle Cancel Button Clicked!");
    navigation.goBack();
  };

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
    setAddress(input);
  };
  const handleBioChange = (input) => {
    console.log(input);
    if (input.length === 0) {
      setBio("");
    } else {
      setBio(input);
    }
  };

  const handleFormSubmit = () => {
    onSubmit();
  };

  const formatSliderValue = (sliderValue) => {
    const formattedSliderValue = Math.round(sliderValue * 4) / 4;
    return formattedSliderValue;
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
      setBio(res.body.bio);
      setSliderValue(res.body.travelRange);
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
      travelRange: formatSliderValue(sliderValue),
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          listViewDisplayed={false}
        >
          {!isInputFocused && (
            <Picker
              style={[
                Styles.sportsPickerDropdown,
                Styles.input,
                { marginBottom: 10 },
              ]}
              defaultValue={player.calibre}
              placeholderTextColor="grey"
              language={calibreList}
              onValueChange={handleCalibreChange}
              label={player.calibre}
            />
          )}
          {!isInputFocused && (
            <Picker
              style={[
                Styles.sportsPickerDropdown,
                Styles.input,
                { marginBottom: 10 },
              ]}
              defaultValue={player.gender}
              placeholderText
              Color="#005F66"
              onValueChange={handleGenderChange}
              language={genders}
              label={player.gender}
            />
          )}
          {!isInputFocused && (
            <Picker
              style={[
                Styles.sportsPickerDropdown,
                Styles.input,
                { marginBottom: 10 },
              ]}
              defaultValue={player.position}
              placeholderText
              Color="#005F66"
              onValueChange={handlePositionChange}
              language={positions}
              label={player.position}
            />
          )}
          {/* LOCATION SELECTOR */}
          {!isInputFocused && (
            <AddressInput
              handleLocationSelected={captureSelectedLocation}
              defaultLocation={player.location}
              onInputFocus={handleAddressInputFocus}
            />
          )}

          {!isInputFocused && (
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
                marginBottom: 10,
                marginTop: 10,
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
                minimumValue={1}
                maximumValue={35}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                value={sliderValue}
                onValueChange={setSliderValue}
              />
            </View>
          )}
          <View
            style={[
              {
                flex: isBioInputFocused ? 2 : 0,
                height: isBioInputFocused ? "100%" : 100,
                paddingBottom: isBioInputFocused ? 100 : 0,
              },
            ]}
          >
            <View
              style={[
                isBioInputFocused
                  ? {
                      borderWidth: 2,
                      borderColor: "red",
                      flex: isBioInputFocused ? 2 : 0,
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
                  isBioInputFocused
                    ? { padding: 10 }
                    : {
                        textAlign: "center",
                      },
                ]}
                placeholder={
                  bio.length === 0 && isBioInputFocused
                    ? ""
                    : "Player Biography"
                }
                onChangeText={handleBioChange}
                value={bio}
                onFocus={() => handleBioInputFocus()}
                onBlur={() => handleBioInputFocus()}
              />
            </View>
          </View>

          <TouchableOpacity style={{ paddingBottom: 20, paddingTop: 20 }}>
            <Button title="SAVE PLAYER" onPress={() => handleFormSubmit()} />
          </TouchableOpacity>
          {!isKeyboardVisible && (
            <TouchableOpacity>
              <Button
                title="CANCEL"
                onPress={() => handleCancelButtonClick()}
              />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default EditPlayer;
