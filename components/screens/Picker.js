import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "./Styles";

class Pickering extends Component {
  constructor(props) {
    super(props);
    this.state = { language: props.language };
  }

  // allCalibres = this.props.language.map((course, index) => (
  //   <option value={course.id}>{course.position}</option>
  // ));

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
          <Picker.Item
            label={this.props.language[0]}
            value={this.props.language[0]}
          />
          <Picker.Item
            label={this.props.language[1]}
            value={this.props.language[1]}
          />
          <Picker.Item
            label={this.props.language[1]}
            value={this.props.language[1]}
          />
        </Picker>
      </View>
    );
  }
}

export default Pickering;
