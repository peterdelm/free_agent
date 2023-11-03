import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import Styles from "./Styles";
import { Picker } from "@react-native-picker/picker";

class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selected: "",
      inputValue: "Time",
      selectedHour: "00",
      selectedMinute: "00",
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove,
    });
  }

  handleTimeSelect = () => {
    selectedTime = `${this.state.selectedHour}:${this.state.selectedMinute}`;
    this.setState({ inputValue: selectedTime });
    console.log("Selected Time is: " + selectedTime);
    console.log("Hour is: " + `${this.state.selectedMinute}`);
  };

  handleHourChange = (hour) => {
    this.setState({ selectedHour: hour });
  };

  handleMinuteChange = (minute) => {
    this.setState({ selectedMinute: minute });
  };

  openTimePicker = () => {
    this.setState({ modalVisible: true });
  };
  toggleDropdown = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  // Function to close the time picker modal and set the selected time
  onTimeSelect = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { selectedHour, selectedMinute } = this.state;
    return (
      <View>
        <TouchableOpacity onPress={this.openTimePicker}>
          <Text>{this.state.inputValue}</Text>
        </TouchableOpacity>

        {/* Time Picker Modal */}
        <Modal visible={this.state.modalVisible} animationType="slide">
          <View style={styles.container}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedHour}
                onValueChange={(itemValue) =>
                  this.setState({ selectedHour: itemValue })
                }
                style={styles.picker}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <Picker.Item
                    label={i.toString().padStart(2, "0")}
                    value={i.toString().padStart(2, "0")}
                    key={i}
                  />
                ))}
              </Picker>
              <Text style={styles.separator}>:</Text>
              <Picker
                selectedValue={selectedMinute}
                onValueChange={(itemValue) =>
                  this.setState({ selectedMinute: itemValue })
                }
                style={styles.picker}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <Picker.Item
                    label={i.toString().padStart(2, "0")}
                    value={i.toString().padStart(2, "0")}
                    key={i}
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity style={styles.selectButton}>
              <Text
                style={styles.selectButtonText}
                onPress={() => {
                  this.toggleDropdown();
                  this.handleTimeSelect();
                }}
              >
                Select
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    flex: 1,
  },
  separator: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  selectButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  selectButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TimePicker;
