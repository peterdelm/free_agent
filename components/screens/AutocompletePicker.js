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
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";

class AutoCompletePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options || "",
      showDropdown: false,
      inputPosition: null,
      query: "",
      addressFragment: "",
      suggestionList: [""],
      addressInputSelected: false,
      selectedAddress: "",
      inputValue: "",
      style: props.style,
    };
  }

  handleAddressChange = (input) => {
    this.setState({ query: input }, () => {
      console.log("Updated query state:", this.state.query);

      if (this.state.query.length > 2) {
        this.fetchAutocompleteSuggestions(this.state.query)
          .then((data) => {
            this.setState({
              suggestionList: data.addressList,
              addressInputSelected: true,
              showDropdown: true,
            });

            console.log("The returned suggestion list is:", data.addressList);
          })
          .catch((error) => {
            console.error("Error fetching suggestions:", error);
          });
      }
    });
  };

  async fetchAutocompleteSuggestions(addressFragment) {
    const url = `${EXPO_PUBLIC_BASE_URL}api/geocoding`;
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
      } else {
        console.log("Address Suggestions Failed");
      }

      return data;
    } catch (err) {
      console.error(err);
      throw err;
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
  };

  handleTextInputBlur = () => {};

  render() {
    return (
      <View style={this.state.style}>
        <TextInput
          ref={(ref) => (this.textInputRef = ref)}
          placeholder="Location"
          defaultValue=""
          value={this.state.inputValue}
          placeholderTextColor="grey"
          onChangeText={(addressFragment) => {
            this.handleAddressChange(addressFragment);
            this.setState({ inputValue: addressFragment });
          }}
          label="Location"
          onFocus={this.handleTextInputFocus}
          onBlur={this.handleTextInputBlur}
          style={{ margin: 2, padding: 20 }}
        />

        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.showDropdown}
          onRequestClose={this.toggleDropdown}
        >
          <View
            style={{
              position: "absolute",
              top:
                this.state.inputPosition &&
                this.state.inputPosition.y !== undefined &&
                this.state.inputPosition.height !== undefined
                  ? this.state.inputPosition.y + this.state.inputPosition.height
                  : 0,
              left: this.state.inputPosition?.x || 0,
              width: this.state.inputPosition?.width || 0,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <FlatList
              style={{
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
              }}
              data={this.state.suggestionList}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.toggleDropdown();
                    this.props.onInputSelected(item);
                    this.setState({ inputValue: item });
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="always"
            />
          </View>
        </Modal>
      </View>
    );
  }
}

export default AutoCompletePicker;
