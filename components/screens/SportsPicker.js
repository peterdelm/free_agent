import React, { Component } from "react";
import { View, Platform, StyleSheet, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "./Styles";
import { AntDesign } from "@expo/vector-icons";
class SportsPicker extends Component {
  render() {
    const { sportsData, label, colour, onValueChange, selectedSport, style } =
      this.props;

    return (
      <View style={[styles.container, style]}>
        <Picker
          style={{
            flex: 1,
            alignSelf: "stretch",
          }}
          itemStyle={{ height: 50 }}
          selectedValue={selectedSport ? selectedSport.sport : ""}
          onValueChange={(itemName) => {
            const itemValue = sportsData.find(
              (sport) => sport.sport === itemName
            );
            onValueChange(itemValue);
          }}
          placeholderTextColor="grey"
        >
          <Picker.Item color={colour} label={label} value="" />

          {sportsData && sportsData.length > 0 ? (
            sportsData.map((sport, index) => (
              <Picker.Item
                key={index}
                label={sport.sport}
                value={sport.sport}
              />
            ))
          ) : (
            <Picker.Item label="No sports available" value="" />
          )}
        </Picker>
        {Platform.OS === "ios" && (
          <View style={styles.arrowContainer}>
            <Image
              style={styles.arrowImage}
              source={require("../../assets/chevron-down-solid.png")}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  arrowContainer: {
    display: "flex",
    position: "absolute",
    // top: "50%",
    transform: [{ translateX: 75 }], // Half of the arrow height
    overflow: "visible", // Allow the arrow to overflow the container
    height: 10,
    width: 10,
  },
  arrowImage: {
    width: "auto",
    height: "100%",
    resizeMode: "contain",
  },
});

export default SportsPicker;
