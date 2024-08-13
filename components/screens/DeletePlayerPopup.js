import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useState, useEffect, Component } from "react";
import Styles from "./Styles.js";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter.js";
import getCurrentUser from "./getCurrentUser.helper.js";
import formatDate from "./formatDate.js";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import MapComponent from "./MapComponent.js";
import ColorToggleButton from "./ColorToggleButton.js";
import authFetch from "../../api/authCalls.js";

const DeletePlayerPopup = ({ isModalVisible, handleButtonPress, onClose }) => {
  console.log("DeletePlayer Popup");
  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose} // Handles hardware back button press on Android
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Are you sure you want to delete this player profile?
          </Text>
          <TouchableOpacity
            onPress={handleButtonPress}
            style={styles.modalButton}
          >
            <Text style={styles.modalButtonText}>Delete Player</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
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

export default DeletePlayerPopup;
