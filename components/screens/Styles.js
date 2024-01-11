import React from "react";
import {
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";

const Styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A4D65E",
  },
  image: {
    width: 100,
    height: 100,
  },
  inputView: {
    backgroundColor: "white",
    borderRadius: 30,
    width: 250,
    height: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  welcomeScreenInputs: {
    backgroundColor: "white",
    borderRadius: 30,
    width: 250,
    height: 60,
    marginBottom: 20,
    alignItems: "center",
  },
  homeContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#A4D65E",
    borderWidth: 1, // Border width
    borderColor: "orange", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },
  primaryButton: {
    width: 325,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "#EB6FBD",
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: 40,
  },

  activeGames: {
    width: 325,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#EB6FBD",
    textAlign: "center",
    textAlignVertical: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  forgotButton: {
    height: 30,
    marginBottom: 30,
  },
  loginButton: {
    width: 250,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "#EB6FBD",
    textAlign: "center",
    textAlignVertical: "center",
  },
  registerButton: {
    width: 250,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "#EB6FBD",
    textAlign: "center",
    textAlignVertical: "center",
  },
  autoCompleteInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10, // Adjust padding to center the placeholder text
  },
  dropdown: { width: 250 },

  clockContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  clockSeparator: { fontSize: 18, paddingHorizontal: 10 },

  clockInput: {
    width: 50,
    borderWidth: 1,
    borderColor: "gray",
    fontSize: 18,
    textAlign: "center",
  },

  screenContainer: {
    alignItems: "flex-start",
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "blue", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  pendingContainer: {
    justifyContent: "flex-start", // Left-align children
    alignItems: "center",
    width: "100%",
  },

  pendingGamesContainer: {
    justifyContent: "flex-start", // Left-align children
    width: "100%",
    // borderColor: "orange", // Border color
    // borderWidth: 1, // Border width
    // borderRadius: 5, // Border radius (optional)
    // padding: 5, // Optional padding
  },

  requestPlayerContainer: {
    alignItems: "flex-start",
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "blue", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  requestPlayerButtonContainer: {
    alignItems: "center",
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "red", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  requestPlayerButton: {
    width: 385,
    borderRadius: 10,
    height: 100,
    backgroundColor: "#EB6FBD",
    textAlign: "center",
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },

  requestPlayerButtonText: {
    fontSize: 20,
  },
  requestPlayerButtonSymbol: {},

  screenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Left-align children
    paddingLeft: "5%", // Optional padding
  },

  pendingGames: {
    width: 385,
    borderRadius: 25,
    height: 50,
    marginBottom: 10,
    borderColor: "red", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  sportsPickerDropdownContainer: {
    alignItems: "center",
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "red", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  sportsPickerDropdown: {
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "dark green", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
    backgroundColor: "#FFFFFF",
  },

  datePickerButton: {
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "dark green", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
    backgroundColor: "#FFFFFF",
  },

  additionalInfo: {
    width: "100%",
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
    backgroundColor: "#FFFFFF",
    paddingLeft: 20,
  },
});

export default Styles;
