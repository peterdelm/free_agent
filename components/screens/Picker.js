import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "./Styles";

class Pickering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.language,
      label: props.label,
    };
  }

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
          <Picker.Item color="grey" label={this.props.label} value="" />

          {
            (allCalibres = this.props.language.map((course, index) => (
              <Picker.Item
                label={this.props.language[index]}
                value={this.props.language[index]}
              />
            )))
          }
        </Picker>
      </View>
    );
  }
}

export default Pickering;
