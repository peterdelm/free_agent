import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

const CustomToggleSwitch = ({ user }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    if (user && user.isActive !== undefined) {
      setIsEnabled(user.isActive);
      setCurrentUser(user);
    }
  }, [user]);
  console.log("User status is", user.isActive);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isEnabled ? styles.containerEnabled : styles.containerDisabled,
      ]}
      onPress={toggleSwitch}
    >
      <View
        style={[
          styles.circle,
          isEnabled ? styles.circleEnabled : styles.circleDisabled,
        ]}
      >
        {isEnabled && <View style={styles.checkMark} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    padding: 2,
  },
  containerEnabled: {
    backgroundColor: "black",
  },
  containerDisabled: {
    backgroundColor: "lightgrey",
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "white",
  },
  circleEnabled: {
    alignSelf: "flex-end",
  },
  circleDisabled: {
    alignSelf: "flex-start",
  },
  checkMark: {
    width: 10,
    height: 10,
    backgroundColor: "white",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 5,
  },
});

export default CustomToggleSwitch;
