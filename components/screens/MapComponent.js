import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import Styles from "./Styles";

export default function MapComponent({ activeGames }) {
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
              : -79.335186;
          const longitude =
            game.geocoordinates && game.geocoordinates.longitude
              ? game.geocoordinates.longitude
              : -79.383196;

          return {
            id: index,
            title: game.id,
            coordinate: { latitude, longitude },
          };
        })
      : [];

  console.log("Markers are:", markers);

  const handleMarkerPress = () => {
    console.log("Marker Pressed");
    console.log("Active game 1 is:", markers);
  };

  return (
    <View style={Styles.playerHomeMapContainer}>
      <MapView style={styles.map} region={initial_region}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            provider={PROVIDER_GOOGLE}
            onPress={handleMarkerPress}
          />
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
