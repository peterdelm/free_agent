import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Styles from "./Styles";

class AutoCompletePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options || "",
      showDropdown: false,
      inputPosition: null,
      query: "",
      addressFragment: "",
    };
  }

  handleAddressChange = (input) => {
    let data = {};
    this.setState({ query: input });
    console.log(this.state.query);
    // if (this.query.length > 2) {
    //   fetchAutocompleteSuggestions(this.query);
    // }
    // setSuggestionList(data.addressList);
    // setAddressInputSelected(true);
  };

  async fetchAutocompleteSuggestions(addressFragment) {
    const url = process.env.EXPO_PUBLIC_BASE_URL + "api/geocoding";
    console.log("AddressFragment is " + addressFragment);
    console.log("Fetch Autocomplete Suggestions called");

    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      addressFragment: addressFragment,
    };

    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    };
    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();

      if (data.success === true) {
        console.log("Address Suggestions successful");
        console.log(data.addressList);
      } else {
        console.log("Address Suggestions Failed");
      }

      return data; // Return the data if needed.
    } catch (err) {
      console.error(err);
      throw err; // Rethrow the error for further handling, if necessary.
    }
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  handleTextInputFocus = () => {
    this.textInputRef.measureInWindow((x, y, width, height) => {
      this.setState({
        inputPosition: { x, y, width, height },
      });
      console.log("Input position is" + this.state.inputPosition.y);
    });
    this.addressFragment;
    this.toggleDropdown();
  };

  handleTextInputBlur = () => {
    this.toggleDropdown();
  };

  render() {
    return (
      <View>
        <TextInput
          ref={(ref) => (this.textInputRef = ref)}
          style={Styles.TextInput}
          placeholder="Location"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(addressFragment) =>
            this.handleAddressChange(addressFragment)
          }
          label="Location"
          onFocus={this.handleTextInputFocus}
          onBlur={this.handleTextInputBlur}
        />

        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.showDropdown}
          onRequestClose={this.toggleDropdown}
          const
        >
          <View
            style={{
              position: "absolute",
              top:
                this.state.inputPosition &&
                this.state.inputPosition.y !== undefined &&
                this.state.inputPosition.height !== undefined
                  ? this.state.inputPosition.y + this.state.inputPosition.height
                  : 0, // Default value or another appropriate value
              left: this.state.inputPosition?.x || 0, // Default value or another appropriate value
              width: this.state.inputPosition?.width || 0, // Default value or another appropriate value
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
            }}
          >
            <FlatList
              data={this.props.options}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.toggleDropdown()}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

export default AutoCompletePicker;
