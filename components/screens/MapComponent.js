import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import Styles from "./Styles";

export default function MapComponent({ navigation, activeGames }) {
  const initial_region = {
    latitude: 43.653225,
    longitude: -79.383186,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  };

  const markers =
    activeGames && activeGames.length > 0
      ? activeGames.map(({ game }, index) => {
          const latitude =
            game.geocoordinates && game.geocoordinates.latitude
              ? game.geocoordinates.latitude
              : 0;
          const longitude =
            game.geocoordinates && game.geocoordinates.longitude
              ? game.geocoordinates.longitude
              : 0;

          const rawDate = "2024-12-12T00:00:00.000Z";
          const date = new Date(rawDate);
          const month = date.toLocaleString("en-US", { month: "long" });
          const day = date.getDate();

          const time = new Date(`1970-01-01T${game.time}`);
          const hours = time.getHours();
          const minutes = time.getMinutes();
          const formattedTime = `${hours}:${minutes
            .toString()
            .padStart(2, "0")}`;
          const formattedDate = `${month} ${day} @ ${formattedTime}`;

          console.log(formattedDate);

          const address = game.location;

          const description = `${formattedDate}\n${address}`;

          return {
            id: index,
            gameId: game.id,
            title: game.gameType + " " + game.sport,
            date: formattedDate,
            address: address,
            description: description,
            coordinate: { latitude, longitude },
          };
        })
      : [];

  console.log("Markers are:", markers);

  const handleMarkerPress = (gameId) => {
    console.log("Marker Pressed");
  };

  const handleCalloutPress = (gameId) => {
    console.log("Callout Pressed");
    navigation.navigate("ViewGame", { gameId: gameId });
  };

  return (
    <View style={Styles.playerHomeMapContainer}>
      <MapView style={styles.map} region={initial_region}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            description={`${marker.date}`}
            provider={PROVIDER_GOOGLE}
            onPress={() => handleMarkerPress(marker.gameId)}
          >
            <Callout onPress={() => handleCalloutPress(marker.gameId)}>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text>{marker.title}</Text>
                <Text>{marker.date}</Text>
                <Text style={{ color: "red" }}>Details</Text>
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
});
