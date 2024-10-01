import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const CLOCK_RADIUS = width * 0.4; // Adjust the clock radius based on the screen width
const CLOCK_CENTER = CLOCK_RADIUS / 2;
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function CircularClockPicker() {
  const [selectedHour, setSelectedHour] = useState(12);
  const [amPm, setAmPm] = useState("AM");

  const toggleAmPm = () => {
    setAmPm((prev) => (prev === "AM" ? "PM" : "AM"));
  };

  // Function to calculate the position of each hour on the clock
  const getHourPosition = (hour) => {
    const angle = ((hour - 3) * Math.PI) / 6; // Offset to rotate the clock face (0 radians starts at 3 o'clock)
    const x = CLOCK_CENTER + CLOCK_RADIUS * 0.45 * Math.cos(angle); // 0.45 to keep the hours inside the clock face
    const y = CLOCK_CENTER + CLOCK_RADIUS * 0.45 * Math.sin(angle);
    return { top: y, left: x };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectedTime}>
        {selectedHour.toString().padStart(2, "0")}:00 {amPm}
      </Text>
      <View style={styles.clockContainer}>
        {/* Circular clock face */}
        <View style={styles.clockFace}>
          {HOURS.map((hour) => {
            const { top, left } = getHourPosition(hour);
            return (
              <TouchableOpacity
                key={hour}
                style={[styles.hourButton, { top, left }]}
                onPress={() => setSelectedHour(hour)}
              >
                <Text style={styles.hourText}>{hour}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {/* AM/PM Toggle */}
      <TouchableOpacity style={styles.amPmButton} onPress={toggleAmPm}>
        <Text style={styles.amPmText}>{amPm}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTime: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  clockContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  clockFace: {
    width: CLOCK_RADIUS,
    height: CLOCK_RADIUS,
    borderRadius: CLOCK_RADIUS / 2,
    borderWidth: 2,
    borderColor: "#ccc",
    position: "relative",
  },
  hourButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  hourText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amPmButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  amPmText: {
    fontSize: 20,
    color: "white",
  },
});
