import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "./Styles";

class Pickering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.language,
      label: props.label,
      colour: props.colour,
      style: props.style,
    };
  }

  render() {
    return (
      <View
        style={[
          this.state.style,
          (style = {
            // flexDirection: "row",
            // borderColor: "red",
            // borderWidth: 2,
          }),
        ]}
      >
        <Picker
          selectedValue={this.state.language}
          onValueChange={(itemValue) => {
            this.setState({ language: itemValue });
            this.props.onValueChange(itemValue);
          }}
          itemStyle={{ height: 50 }}
        >
          <Picker.Item
            color={this.props.colour}
            label={this.props.label}
            value=""
          />

          {this.props.language.map((course, index) => (
            <Picker.Item key={index} label={course} value={course} />
          ))}
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
  arrowContainer: {
    position: "absolute",
    transform: [{ translateX: 170 }, { translateY: 20 }], // Half of the arrow height
    height: 10,
    width: 10,
  },
  arrowImage: {
    width: "auto",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Pickering;
