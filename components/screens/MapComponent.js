import { useRef, useState, useEffect } from "react";
import { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { StyleSheet, View, Text } from "react-native";
import Styles from "./Styles";
import ClusterViewModal from "./clusterViewModal.js";

export default function MapComponent({
  navigation,
  activeGames = [],
  playerLocation = {},
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState([]);

  const startingLongitude = playerLocation?.longitude || -79.347015;
  const startingLatitude = playerLocation?.latitude || 43.65107;
  const initialRegion = {
    latitude: startingLatitude,
    longitude: startingLongitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const openModal = () => {
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const formatGameDate = (isoDateString, time) => {
    let date = new Date(isoDateString);

    if (isNaN(date)) {
      console.error("Invalid date:", isoDateString);
      date = new Date(`1970-01-01T${time}`);
    }
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();

    const formattedTime = formatTime(time);
    return `${month} ${day} @ ${formattedTime}`;
  };

  const parse24HourTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return { hours, minutes, seconds };
  };

  const convertTo12HourFormat = (hours) => {
    const amPm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0 hours to 12 for AM
    return { hours12, amPm };
  };

  const formatTime = (timeString) => {
    if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
      return "Invalid time";
    }
    const { hours, minutes } = parse24HourTime(timeString);
    const { hours12, amPm } = convertTo12HourFormat(hours);
    return `${hours12}:${String(minutes).padStart(2, "0")} ${amPm}`;
  };

  const markers = activeGames.map(({ game }, index) => {
    const latitude = game.geocoordinates?.latitude || 0;
    const longitude = game.geocoordinates?.longitude || 0;
    const formattedDate = formatGameDate(game.date, game.time);
    const description = `${formattedDate}\n${game.location}`;

    return {
      id: game.id, // Use a unique identifier
      gameId: game.id,
      title: `${game.gameType} ${game.sport}`,
      date: formattedDate,
      rawDate: game.date,
      sport: game.sport,
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

  const handleClusterPress = async (cluster, markers) => {
    setSelectedCluster(markers);
    openModal();
    console.log("Cluster Pressed:", cluster);
    console.log("Markers in cluster:", markers);
  };

  return (
    <View style={Styles.playerHomeMapContainer}>
      <MapView
        style={styles.map}
        region={initialRegion}
        onClusterPress={(cluster, markers) =>
          handleClusterPress(cluster, markers)
        }
        preserveClusterPressBehavior={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.gameId}
            gameId={marker.gameId}
            coordinate={marker.coordinate}
            description={marker.description}
            date={marker.date}
            sport={marker.sport}
            provider={PROVIDER_GOOGLE}
            rawDate={marker.rawDate}
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
      <ClusterViewModal
        isModalVisible={isModalVisible}
        activeGames={selectedCluster}
        // handleButtonPress={}
        navigation={navigation}
        onClose={closeModal}
      />
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
