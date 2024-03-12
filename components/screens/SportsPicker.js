import React, { Component } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "./Styles";

class SportsPicker extends Component {
  render() {
    const { sportsData, label, colour, onValueChange, selectedSport, style } =
      this.props;

    return (
      <View style={style}>
        <Picker
          style={style}
          selectedValue={selectedSport}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          placeholderTextColor="grey"
        >
          <Picker.Item color={colour} label={label} value="" />

          {sportsData && sportsData.length > 0 ? (
            sportsData.map((sport, index) => (
              <Picker.Item key={index} label={sport.sport} value={sport} />
            ))
          ) : (
            <Picker.Item label="No sports available" value="" />
          )}
        </Picker>
      </View>
    );
  }
}

export default SportsPicker;
