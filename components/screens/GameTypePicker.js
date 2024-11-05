import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";

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

  componentDidUpdate(prevProps) {
    // Reset values when reset prop changes
    if (
      prevProps.resetTrigger !== this.props.resetTrigger &&
      this.props.resetTrigger
    ) {
      this.resetValues();
    }
  }

  resetValues = () => {
    this.setState({ language: "" }); // Reset selectedLanguage to an empty string
  };

  render() {
    return (
      <View style={[this.state.style]}>
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

          {/* Render actual options if available */}
          {this.props.language && this.props.language.length > 0 ? (
            this.props.language.map((course, index) => (
              <Picker.Item key={index} label={course} value={course} />
            ))
          ) : (
            // Optionally, you can add another placeholder or keep this empty
            <Picker.Item
              label="Please Select a Sport First"
              value="no_options"
            />
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
