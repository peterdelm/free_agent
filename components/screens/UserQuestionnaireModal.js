import { Text, View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import React from "react";

const UserQuestionnairePopup = ({
  isModalVisible,
  handleButtonPress,
  onClose,
}) => {
  console.log("UserQuestionnaire Popup");
  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Care to tell us why you cancelled your game?
          </Text>
          <TouchableOpacity
            onPress={handleButtonPress}
            style={styles.modalButton}
          >
            <Text style={styles.modalButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>No Thanks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
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
    width: "80%", // Adjust width as needed
    maxWidth: 400, // Set a max width to prevent it from getting too large
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default UserQuestionnairePopup;
