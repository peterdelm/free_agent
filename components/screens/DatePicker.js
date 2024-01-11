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
import { Calendar, LocaleConfig } from "react-native-calendars";

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selected: "",
      availableDates: generateAvailableDates(),
      inputValue: "Date",
      style: props.style,
    };
  }

  openDatePicker = () => {
    this.setState({ modalVisible: true });
  };
  toggleDropdown = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  // Function to close the date picker modal and set the selected date
  onDateSelect = (date) => {
    this.setState({ selectedDate: date });
    this.setState({ modalVisible: false });
    this.props.onInputSelected(date);
  };

  render() {
    return (
      <View style={this.state.style}>
        <TouchableOpacity onPress={this.openDatePicker}>
          <Text style={{ textAlign: "center" }}>{this.state.inputValue}</Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        <Modal visible={this.state.modalVisible} animationType="slide">
          <View>
            <Calendar
              onDayPress={(day) => {
                this.setState({
                  selected: day.dateString,
                  inputValue: day.dateString,
                });
                this.onDateSelect(day);
                this.toggleDropdown();
              }}
              markedDates={{
                [this.state.selected]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: "orange",
                },
              }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
// Function to generate a list of available dates, e.g., for a week
function generateAvailableDates() {
  const startDate = new Date(); // Start from today
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 6); // Display dates for a week

  const availableDates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    availableDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableDates;
}
export default DatePicker;
