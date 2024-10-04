import React, { Component } from "react";
import Styles from "./Styles";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from "react-native";

const TOTAL_HOURS = 12;
const TOTAL_MINUTES = 60;

class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      inputValue: "Time",
      pendingInputValue: "",
      pendingHour: "00",
      pendingMinute: "00",
      selectedHour: "00",
      selectedMinute: "00",
      pendingRotations: { hour: 0, minute: 0 },
      savedRotations: { hour: 0, minute: 0 },
      isHourSelector: true,
      clockDimensions: { x: 0, y: 0, width: 0, height: 0 },
      isAM: true, // AM/PM state
    };

    this.clockRadius = Dimensions.get("window").width / 3;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderRelease,
    });
  }

  // resetTimePickerValues = () => {
  //   this.setState({
  //     modalVisible: false,
  //     inputValue: "Time",
  //     selectedHour: "00",
  //     selectedMinute: "00",
  //     isAM: true, // Reset AM/PM
  //   });
  // };

  snapToNearest = (angle, isHourSelector) => {
    const totalValues = isHourSelector ? TOTAL_HOURS : TOTAL_MINUTES;
    const step = 360 / totalValues;
    const snappedValue = Math.round(angle / step) * step;
    return snappedValue;
  };

  handleLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    this.setState({ clockDimensions: { x, y, width, height } });
  };

  calculateAngle = (x, y) => {
    const { clockDimensions } = this.state;
    const clockCenterX = clockDimensions.x + clockDimensions.width / 2;
    const clockCenterY = clockDimensions.y + clockDimensions.height / 2;
    const dx = x - clockCenterX;
    const dy = y - clockCenterY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return (angle + 90 + 360) % 360;
  };

  handlePanResponderMove = (e) => {
    const { pageX, pageY } = e.nativeEvent;
    const angle = this.calculateAngle(pageX, pageY);
    const { isHourSelector } = this.state;

    const snappedAngle = this.snapToNearest(angle, isHourSelector);
    if (isHourSelector) {
      const hour = Math.round(snappedAngle / (360 / TOTAL_HOURS));
      this.setState({
        pendingHour: hour.toString().padStart(2, "0"),
        pendingRotations: {
          ...this.state.pendingRotations,
          hour: snappedAngle,
        },
      });
    } else {
      const minute = Math.round(snappedAngle / (360 / TOTAL_MINUTES));
      this.setState({
        pendingMinute: minute.toString().padStart(2, "0"),
        pendingRotations: {
          ...this.state.pendingRotations,
          minute: snappedAngle,
        },
      });
    }
  };

  handlePanResponderRelease = () => {
    const { isHourSelector, pendingRotations, isAM } = this.state;
    if (isHourSelector) {
      this.setState({
        isHourSelector: false,
      });
    } else {
      const hour =
        this.state.pendingHour === "12"
          ? isAM
            ? "00"
            : "12"
          : isAM
            ? this.state.pendingHour
            : String(Number(this.state.pendingHour) + 12).padStart(2, "0");
      const pendingInputValue = `${hour}:${this.state.pendingMinute}`;
      console.log("pendingInputValue is:", pendingInputValue);
      this.setState({
        pendingInputValue: pendingInputValue,
      });
    }
  };

  handleCancelButtonPress = () => {
    this.setState({
      modalVisible: false,
      selectedHour: this.state.selectedHour,
      selectedMinute: this.state.selectedHour,
      displayHour: this.state.selectedHour,
      displayMinute: this.state.selectedMinute,
      pendingRotations: this.state.savedRotations,
      pendingHour: this.state.selectedHour,
      pendingMinute: this.state.selectedMinute,
    });
  };

  handleOkButtonPress = () => {
    const { isHourSelector, pendingRotations, isAM } = this.state;

    const hour =
      this.state.pendingHour === "12"
        ? isAM
          ? "00"
          : "12"
        : isAM
          ? this.state.pendingHour
          : String(Number(this.state.pendingHour) + 12).padStart(2, "0");
    const pendingInputValue = `${hour}:${this.state.pendingMinute}`;
    console.log("Selected time is:", pendingInputValue);

    this.setState({
      modalVisible: false,
      inputValue: pendingInputValue,
      selectedHour: this.state.pendingHour,
      selectedMinute: this.state.pendingMinute,
      pendingRotations: this.state.pendingRotations,
      savedRotations: this.state.pendingRotations,
      pendingHour: this.state.pendingHour,
      pendingMinute: this.state.pendingMinute,
    });
    this.props.onInputSelected(pendingInputValue);
  };

  toggleDropdown = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isHourSelector: true,
      isAM: true, // Reset AM/PM selection
    });
  };

  toggleAMPM = () => {
    this.setState((prevState) => ({ isAM: !prevState.isAM }));
  };

  renderAMPMToggle = () => {
    const { isAM } = this.state;
    return (
      <View style={styles.amPmContainer}>
        <TouchableOpacity
          style={[
            styles.amPmButton,
            styles.amButton,

            isAM && styles.amPmButtonActive, // Apply active style for AM
          ]}
          onPress={() => this.setState({ isAM: true })}
        >
          <Text
            style={[
              styles.amPmText,
              isAM && styles.amPmTextActive, // Active text color for AM
            ]}
          >
            AM
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.amPmButton,
            styles.pmButton,
            !isAM && styles.amPmButtonActive, // Apply active style for PM
          ]}
          onPress={() => this.setState({ isAM: false })}
        >
          <Text
            style={[
              styles.amPmText,
              !isAM && styles.amPmTextActive, // Active text color for PM
            ]}
          >
            PM
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderClockNumbers = () => {
    return Array.from({ length: TOTAL_HOURS }, (_, i) => {
      const angle = i * -30 * (Math.PI / 180) + Math.PI / 2; // Adjust angle
      const x = (this.clockRadius / 1.25) * Math.cos(angle);
      const y = (this.clockRadius / 1.25) * Math.sin(angle);
      return (
        <Text
          key={i + 1}
          style={[
            styles.number,
            { transform: [{ translateX: x }, { translateY: -y }] },
          ]}
        >
          {i === 0 ? 12 : i}
        </Text>
      );
    });
  };

  displayClockDigits = () => {
    const { pendingHour, pendingMinute } = this.state;
    return `${pendingHour}:${pendingMinute}`;
  };

  convertToAMPM = (inputValue) => {
    if (inputValue == "Time") {
      return "Time";
    } else {
      const [hour, minute] = inputValue.split(":").map(Number);

      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12; // Convert to 12-hour format and handle "0" as "12"

      return `${hour12}:${minute < 10 ? `0${minute}` : minute} ${ampm}`;
    }
  };

  render() {
    const {
      selectedHour,
      selectedMinute,
      pendingRotations,
      savedRotations,
      isHourSelector,
      inputValue,
      modalVisible,
      isAM,
    } = this.state;

    return (
      <View style={[Styles.datePickerButton, Styles.input]}>
        <TouchableOpacity
          onPress={this.toggleDropdown}
          accessibilityLabel="Select Time"
        >
          <Text style={{ textAlign: "center" }}>
            {this.convertToAMPM(inputValue)}
          </Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.container}>
            {/* Time Display inside the blue square */}
            <View
              style={{
                justifyContent: "center", // Center vertically
                alignItems: "center", // Center horizontally
                flexDirection: "row",
              }}
            >
              {/* Time Text */}
              <Text
                style={[
                  styles.selectedTimeText,
                  {
                    textAlign: "center", // Center the text inside
                  },
                ]}
              >
                <Text>{this.displayClockDigits()}</Text>
                {/* {isAM ? "AM" : "PM"} */}
              </Text>

              {/* Render AM/PM Toggle */}
              {this.renderAMPMToggle()}
            </View>

            <View
              style={styles.clockContainer}
              onLayout={this.handleLayout}
              {...this.panResponder.panHandlers}
            >
              {this.renderClockNumbers()}

              {/* Hour hand */}
              <View
                style={[
                  styles.hand,
                  {
                    transform: [
                      { translateX: -1 },
                      { rotate: `${pendingRotations.hour}deg` },
                    ],
                    height: this.clockRadius / 1,
                  },
                ]}
              />
              {/* Minute hand */}
              {!isHourSelector && (
                <View
                  style={[
                    styles.hand,
                    {
                      backgroundColor: "red",
                      transform: [
                        { translateX: -1 },
                        { rotate: `${pendingRotations.minute}deg` },
                      ],
                      height: this.clockRadius,
                    },
                  ]}
                />
              )}
              <View style={styles.centerDot} />
            </View>
            <View style={{ width: "90%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={this.handleCancelButtonPress}
                >
                  <Text style={styles.selectButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={this.handleOkButtonPress}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      { paddingLeft: 5, paddingRight: 5 },
                    ]}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTimeText: {
    fontSize: 60,
    fontWeight: "bold",
  },
  clockContainer: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").width / 1.5,
    borderRadius: Dimensions.get("window").width / 3,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  hand: {
    width: 2,
    backgroundColor: "black",
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transformOrigin: "0% 100%",
  },
  centerDot: {
    width: 10,
    height: 10,
    backgroundColor: "black",
    borderRadius: 5,
    position: "absolute",
  },
  number: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  selectButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 10,
  },
  selectButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  amPmContainer: {
    flexDirection: "column", // Stack buttons vertically
    alignItems: "center", // Center the buttons horizontally
    marginVertical: 20,
  },
  amPmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
    backgroundColor: "#F0F0F0", // Default background for inactive state
  },
  amButton: { borderTopLeftRadius: 10, borderTopRightRadius: 10 },

  pmButton: { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },

  amPmButtonActive: {
    backgroundColor: "#7D3C98", // Active background
  },
  amPmText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  amPmTextActive: {
    color: "white", // Active text color
  },
});

export default TimePicker;
