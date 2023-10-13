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
      showDropdown: props.showDropdown,
    };
  }

  fetchAutocompleteSuggestions = async (addressFragment) => {
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
  };

  handleAddressChange = (input) => {
    let data = {};
    setQuery(input);
    if (query.length > 2) {
      fetchAutocompleteSuggestions(query);
    }
    setSuggestionList(data.addressList);
    setAddressInputSelected(true);
  };

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  render() {
    return (
      <View>
        <TextInput
          style={Styles.TextInput}
          placeholder="Location"
          defaultValue=""
          placeholderTextColor="#005F66"
          onChangeText={(addressFragment) =>
            handleAddressChange(addressFragment)
          }
          label="Location"
          onFocus={this.toggleDropdown}
        />

        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.showDropdown}
          onRequestClose={this.toggleDropdown}
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
        </Modal>
      </View>
    );
  }
}

export default AutoCompletePicker;
