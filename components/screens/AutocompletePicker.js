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

class AutoCompletePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options || "",
      showDropdown: props.showDropdown,
    };
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  render() {
    return (
      <View>
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
