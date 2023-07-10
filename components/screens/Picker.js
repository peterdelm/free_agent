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
          onValueChange={(itemValue) => {
            this.setState({ language: itemValue });
            this.props.onValueChange(itemValue);
          }}
        >
          <Picker.Item color="grey" label={this.props.label} value="" />

          {this.props.language.map((course, index) => (
            <Picker.Item key={index} label={course} value={course} />
          ))}
        </Picker>
      </View>
    );
  }
}

export default Pickering;
