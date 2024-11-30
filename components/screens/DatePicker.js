import React, { Component } from "react";
import { Text, View, Modal, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

class DatePicker extends Component {
  constructor(props) {
    super(props);
    console.log("Initial date prop:", props.input); // Log the date prop
    this.state = {
      modalVisible: false,
      selected: "",
      availableDates: generateAvailableDates(),
      inputValue: props.input || "Date",
      style: props.style,
    };
  }

  formattedDate = () => {
    if (this.state.inputValue === "Date") {
      return "Date";
    } else {
      console.log("this.state.inputValue is", this.state.inputValue);

      const date = new Date(this.state.inputValue);
      console.log("date is", date);

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const formattedDate = date.toLocaleDateString(undefined, options);
      console.log("Formatted datepicker date is:", formattedDate);

      return formattedDate;
    }
  };

  resetDatePickerValues = () => {
    this.setState({
      modalVisible: false,
      selected: "",
      availableDates: generateAvailableDates(),
      inputValue: "Date",
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.input !== this.props.input) {
      this.setState({
        selected: this.props.input || "",
        inputValue: this.props.input || "Date",
      });
    }
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
          <Text style={{ textAlign: "center" }}>{this.formattedDate()}</Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        <Modal visible={this.state.modalVisible} animationType="slide">
          <View>
            <Calendar
              onDayPress={(day) => {
                this.setState({
                  selected: `${day.dateString}T00:00:00`,
                  inputValue: `${day.dateString}T00:00:00`,
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
