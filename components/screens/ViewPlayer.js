import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";
import NavigationFooter from "./NavigationFooter";
import { StyleSheet } from "react-native-web";

function ViewPlayer({ navigation, message }) {
  const route = useRoute();
  const { playerId } = route.params;
  const [player, setPlayer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshPlayers, setRefreshPlayers] = useState(false);
  const { refresh } = route.params || {};

  useEffect(() => {
    if (refresh) {
      setRefreshPlayers(true);
    }
  }, [refresh]);

  console.log("ViewPlayer has received the call!");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${EXPO_PUBLIC_BASE_URL}api/players/${playerId}`;
        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          headers,
        };

        const res = await authFetch(url, requestOptions);

        if (res.status === 200) {
          console.log(res);
          const playerData = res.body;
          setPlayer(playerData);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.log("Error fetching player data:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [playerId, refreshPlayers]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const url = `${EXPO_PUBLIC_BASE_URL}api/players/${playerId}`;
          const headers = {
            "Content-Type": "application/json",
          };

          const requestOptions = {
            headers,
          };

          const res = await authFetch(url, requestOptions);

          if (res.status === 200) {
            console.log(res);
            const playerData = res.body;
            setPlayer(playerData);
          } else {
            throw new Error("Network response was not ok.");
          }
        } catch (error) {
          console.log("Error fetching player data:", error);
          // Handle error
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [refreshPlayers])
  );

  const handleDeletePlayerButtonPress = async () => {
    try {
      const token = await getTokenFromStorage();
      const url = `${EXPO_PUBLIC_BASE_URL}api/players/${playerId}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requestOptions = {
        method: "DELETE",
        headers,
      };

      const res = await fetch(url, requestOptions);
      if (res.ok) {
        console.log("Player deleted successfully.");
        navigation.navigate("ManagePlayers", { refresh: true });
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.log("Error deleting player:", error);
      // Handle error
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
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
          alignItems: "center",
          width: "100%",
        }}
      >
        <View style={Styles.screenHeader}>
          <Text style={{ fontSize: 35, padding: 20 }}>PLAYER PROFILE</Text>
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text style={viewPlayerStyles.text}>
            <Text style={{ fontWeight: "bold" }}>Sport:</Text> {player.sport}
          </Text>

          <Text style={viewPlayerStyles.text}>
            <Text style={{ fontWeight: "bold" }}>Calibre: </Text>
            {player.calibre}
          </Text>
          <Text style={viewPlayerStyles.text}>
            <Text style={{ fontWeight: "bold" }}>Location: </Text>
            {player.location}
          </Text>
          <Text style={viewPlayerStyles.text}>
            <Text style={{ fontWeight: "bold" }}>Travel Range: </Text>
            {player.travelRange} km
          </Text>
          <Text style={viewPlayerStyles.text}>
            <Text style={{ fontWeight: "bold" }}>Bio: </Text>
            {player.bio.length > 0 ? player.bio : "N/A"}
          </Text>
          <Text style={viewPlayerStyles.text}>
            <Text style={{ fontWeight: "bold" }}>Position: </Text>
            {player.position}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditPlayer", {
              playerId: player.id,
              playerSport: player.sport,
            })
          }
        >
          <Text
            style={[
              Styles.input,
              (style = {
                fontSize: 20,
                textAlign: "center",
                textAlignVertical: "center",
                lineHeight: Platform.select({
                  ios: 50,
                }),
                margin: 20,
              }),
            ]}
          >
            Edit Player
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePlayerButtonPress()}>
          <Text
            style={[
              Styles.input,
              (style = {
                fontSize: 20,
                textAlign: "center",
                textAlignVertical: "center",
                lineHeight: Platform.select({
                  ios: 50,
                }),
                margin: 20,
              }),
            ]}
          >
            Delete Player
          </Text>
        </TouchableOpacity>
      </View>
      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
}

const viewPlayerStyles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: "left",
    textAlignVertical: "center",
    lineHeight: Platform.select({
      ios: 50,
    }),
    padding: 10,
  },
});

export default ViewPlayer;
