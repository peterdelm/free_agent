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
      selectedHour: "00",
      selectedMinute: "00",
      hourRotation: 0,
      minuteRotation: 0,
      isHourSelector: true,
      clockDimensions: { x: 0, y: 0, width: 0, height: 0 },
    };

    this.clockRadius = Dimensions.get("window").width / 3;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderRelease,
    });
  }

  resetTimePickerValues = () => {
    this.setState({
      modalVisible: false,
      selected: "",
      inputValue: "Time",
      selectedHour: "00",
      selectedMinute: "00",
    });
  };

  snapToNearest = (angle, isHourSelector) => {
    const totalValues = isHourSelector ? TOTAL_HOURS : TOTAL_MINUTES;

    // Determine the value based on the angle
    let value;

    // Custom snapping logic for specific angles
    if (angle > 15 && angle < 45) {
      value = 30; // Snap to 1
    } else if (angle > 45 && angle < 75) {
      value = 60; // Snap to 2
    } else if (angle > 75 && angle < 105) {
      value = 90; // Snap to 3
    } else if (angle > 105 && angle < 135) {
      value = 120; // Snap to 4
    } else if (angle > 135 && angle < 165) {
      value = 150; // Snap to 5
    } else if (angle > 165 && angle < 195) {
      value = 180; // Snap to 6
    } else if (angle > 195 && angle < 225) {
      value = 210; // Snap to 7
    } else if (angle > 225 && angle < 255) {
      value = 240; // Snap to 8
    } else if (angle > 255 && angle < 285) {
      value = 270; // Snap to 9
    } else if (angle > 285 && angle < 315) {
      value = 300; // Snap to 10
    } else if (angle > 315 && angle < 345) {
      value = 330; // Snap to 11
    } else if (angle > 345 && angle < -15) {
      value = 360; // Snap to 12
    } else {
      value = Math.round(angle / (360 / totalValues));
    }

    return value;
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
    //
    const angle = this.calculateAngle(pageX, pageY);

    if (this.state.isHourSelector) {
      const snappedAngle = this.snapToNearest(angle, true);
      const hour = Math.round(angle / (360 / TOTAL_HOURS));
      this.setState({
        selectedHour: hour.toString().padStart(2, "0"),
        hourRotation: snappedAngle,
      });
    } else {
      const minute = Math.round(angle / (360 / TOTAL_MINUTES));

      this.setState({
        selectedMinute: minute.toString().padStart(2, "0"),
        minuteRotation: angle,
      });
    }
  };

  handlePanResponderRelease = () => {
    const { isHourSelector, hourRotation, minuteRotation } = this.state;
    const angle = isHourSelector ? hourRotation : minuteRotation;

    if (isHourSelector) {
      const snappedAngle = this.snapToNearest(angle, true);
      const hour = Math.round(angle / (360 / TOTAL_HOURS));

      this.setState({
        selectedHour: hour,
        hourRotation: angle, // keep the rotation for visual feedback
        isHourSelector: false, // switch to minute selection
      });
    } else {
      const selectedTime = `${this.state.selectedHour}:${this.state.selectedMinute}`;
      this.setState({
        // selectedMinute: selectedMinute,
        inputValue: selectedTime,
        modalVisible: false,
      });
      this.props.onInputSelected(selectedTime);
    }
  };

  toggleDropdown = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isHourSelector: true, // Start with hour selection each time
    });
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

  render() {
    const {
      selectedHour,
      selectedMinute,
      hourRotation,
      minuteRotation,
      isHourSelector,
    } = this.state;

    return (
      <View style={[Styles.datePickerButton, Styles.input]}>
        <TouchableOpacity
          onPress={this.toggleDropdown}
          accessibilityLabel="Select Time"
        >
          <Text style={{ textAlign: "center" }}>{this.state.inputValue}</Text>
        </TouchableOpacity>

        <Modal visible={this.state.modalVisible} animationType="slide">
          <View style={styles.container}>
            {/* Time Display */}
            <Text style={styles.selectedTimeText}>
              {selectedHour}:{selectedMinute}
            </Text>

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
                      { rotate: `${hourRotation}deg` },
                    ],
                    height: this.clockRadius / 1,
                  },
                ]}
              />
              {/* Minute hand, visible only when minutes are being selected */}
              {!isHourSelector && (
                <View
                  style={[
                    styles.hand,
                    {
                      backgroundColor: "red",
                      transform: [
                        { translateX: -1 },
                        { rotate: `${minuteRotation}deg` },
                      ],
                      height: this.clockRadius,
                    },
                  ]}
                />
              )}
              <View style={styles.centerDot} />
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={this.handleTimeSelect}
            >
              <Text style={styles.selectButtonText}>
                {isHourSelector ? "Select Hour" : "Select Minute"}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTimeText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
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
  },
  selectButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TimePicker;
