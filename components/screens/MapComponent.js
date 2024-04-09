import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import Styles from "./Styles";

export default function MapComponent() {
  const initial_region = {
    latitude: 43.653225,
    longitude: -79.383186,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  };

  const markers = [
    {
      id: 1,
      title: "Marker 1",
      coordinate: { latitude: 43.653235, longitude: -79.383196 },
    },
    {
      id: 2,
      title: "Marker 2",
      coordinate: { latitude: 43.653225, longitude: -79.335186 },
    },
    // Add more markers as needed
  ];

  const handleMarkerPress = () => {
    console.log("Marker Pressed");
  };

  return (
    <View style={Styles.playerHomeMapContainer}>
      <MapView style={styles.map} region={initial_region}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            onPress={() => handleMarkerPress(marker)}
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
