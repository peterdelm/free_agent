import React from "react";
import { View, Text, Modal, ActivityIndicator, StyleSheet } from "react-native";

const SwitchingManagerPlayerModal = ({ isVisible, switchTo }) => {
  const text = `Switching to ${switchTo}`;
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "black",
  },
});

export default SwitchingManagerPlayerModal;
