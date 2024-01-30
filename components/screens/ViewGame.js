import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { View, Text, Image, StatusBar } from "react-native";
import { useRoute } from "@react-navigation/native";
import NavigationFooter from "./NavigationFooter";
import getCurrentUser from "./getCurrentUser.helper";
import { useFocusEffect } from "@react-navigation/native";

function ViewGame({ navigation, message }) {
  const [currentUser, setCurrentUser] = useState({});

  const route = useRoute();
  const { gameId } = route.params;
  const [game, setGame] = useState([]);
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

  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/games/" + gameId;

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
            }
            throw new Error("Network response was not ok.");
          })
          .then((res) => setGame(res));
      } catch (error) {
        console.log("Error making authenticated request:", error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  return (
    <View style={Styles.container}>
      {/* <StatusBar hidden={true} /> */}

      <View style={Styles.screenContainer}>
        <View style={Styles.screenHeader}>
          <Image
            source={require("../../assets/prayingHands.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 35, padding: 20 }}>View Game</Text>
        </View>
      </View>
      <View style={Styles.viewGameContentContainer}>
        <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
          Address
        </Text>

        <Text style={Styles.gameInfo}>{game.location}</Text>
        <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
          Date/Time
        </Text>
        <Text style={Styles.gameInfo}>
          {game.date} @ {game.time}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
          Position
        </Text>
        <Text style={Styles.gameInfo}>{game.position}</Text>
        <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
          Calibre
        </Text>
        <Text style={Styles.gameInfo}>{game.calibre}</Text>
        <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
          Gender
        </Text>
        <Text style={Styles.gameInfo}>Gender: {game.gender}</Text>
        <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
          Game Type
        </Text>
        <Text style={Styles.gameInfo}>{game.game_type}</Text>
        <Text style={{ fontSize: 18, fontWeight: 500, padding: 5 }}>
          Game Length
        </Text>
        <Text style={Styles.gameInfo}>{game.game_length} Minutes</Text>
      </View>
      <NavigationFooter
        currentRole={currentUser.currentRole}
        navigation={navigation}
      ></NavigationFooter>
    </View>
  );
}

export default ViewGame;
