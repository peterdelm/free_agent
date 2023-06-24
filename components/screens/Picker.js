import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "./Styles";

const isPlaceholder = (value) => {
  return value == "";
};

class Pickering extends Component {
  state = {
    language: "",
  };

  render() {
    return (
      <View>
        <Picker
          style={Styles.dropdown}
          selectedValue={this.state.language}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ language: itemValue })
          }
        >
          <Picker.Item color="grey" label="Calibre" value="" />
          <Picker.Item label="English" value="english" />
        </Picker>
      </View>
    );
  }
}

export default Pickering;
