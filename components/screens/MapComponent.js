import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import Styles from "./Styles"; // Ensure Styles has the necessary styles

export default function MapComponent({
  navigation,
  activeGames = [],
  playerLocation = {},
}) {
  const startingLongitude = playerLocation.longitude || 0;
  const startingLatitude = playerLocation.latitude || 0;

  const initialRegion = {
    latitude: startingLatitude,
    longitude: startingLongitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const formatGameDate = (rawDate, time) => {
    const date = new Date(rawDate);
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();

    const timeDate = new Date(`1970-01-01T${time}`);
    const hours = timeDate.getHours();
    const minutes = timeDate.getMinutes();
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
    return `${month} ${day} @ ${formattedTime}`;
  };

  const markers = activeGames.map(({ game }, index) => {
    const latitude = game.geocoordinates?.latitude || 0;
    const longitude = game.geocoordinates?.longitude || 0;
    const formattedDate = formatGameDate("2024-12-12T00:00:00.000Z", game.time);
    const description = `${formattedDate}\n${game.location}`;

    return {
      id: game.id, // Use a unique identifier
      gameId: game.id,
      title: `${game.gameType} ${game.sport}`,
      date: formattedDate,
      address: game.location,
      description: description,
      coordinate: { latitude, longitude },
    };
  });

  const handleMarkerPress = (gameId) => {
    console.log("Marker Pressed");
  };

  const handleCalloutPress = (gameId) => {
    console.log("Callout Pressed");
    navigation.navigate("ViewGame", { gameId });
  };

  return (
    <View style={Styles.playerHomeMapContainer}>
      <MapView style={styles.map} region={initialRegion}>
        {markers.map((marker) => (
          <Marker
            key={marker.gameId} // Use unique key
            coordinate={marker.coordinate}
            description={marker.description}
            provider={PROVIDER_GOOGLE}
            onPress={() => handleMarkerPress(marker.gameId)}
          >
            <Callout onPress={() => handleCalloutPress(marker.gameId)}>
              <View style={styles.calloutContainer}>
                <Text>{marker.title}</Text>
                <Text>{marker.date}</Text>
                <Text style={styles.detailsText}>Details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  calloutContainer: {
    alignItems: "center",
  },
  detailsText: {
    color: "red",
  },
});
