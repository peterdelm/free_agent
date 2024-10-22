import React, { Component } from "react";
import { StyleSheet, View, Platform, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";

class Pickering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.defaultValue || "",
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.resetTrigger !== this.props.resetTrigger &&
      this.props.resetTrigger
    ) {
      console.log("Reset triggered by parent");
      this.resetValues();
    }
  }

  handleValueChange = (itemValue) => {
    console.log("Item value selected:", itemValue); // Log the selected value
    this.setState({ language: itemValue });
    if (this.props.onValueChange) {
      this.props.onValueChange(itemValue);
    }
  };

  resetValues = () => {
    this.setState({ language: "" }); // Reset selectedLanguage to an empty string
  };

  render() {
    const {
      style,
      colour,
      label,
      language: languages,
      appendText,
    } = this.props;
    const { language: selectedLanguage } = this.state;

    return (
      <View style={style}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={this.handleValueChange}
          itemStyle={{ height: 50 }}
        >
          {/* Render label option if needed */}
          {label && <Picker.Item color={colour} label={label} value="" />}

          {/* Render actual options if available */}
          {Array.isArray(languages) && languages.length > 0 ? (
            languages.map((course, index) => (
              <Picker.Item
                key={index}
                label={appendText ? `${course} ${appendText}` : course} // Append text if provided
                value={course}
              />
            ))
          ) : (
            <Picker.Item label="No options available" value="no_options" />
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
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  arrowImage: {
    width: 20,
    height: 20,
  },
});

export default Pickering;
