import React from "react";
import {
  Button,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
  StatusBar,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

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
    backgroundColor: "#FFFFFF",
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
    // borderWidth: 1, // Border width
    // borderColor: "blue", // Border color
    // borderRadius: 5, // Border radius (optional)
    // padding: 5, // Optional padding
  },

  pendingScreenContainer: {
    alignItems: "flex-start",
    width: "100%",
    borderTopWidth: 2,
    borderTopColor: "black",
    borderTopStyle: "solid",
    padding: 16,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    borderBottomStyle: "solid",
  },

  pendingContainer: {
    justifyContent: "flex-start", // Left-align children
    alignItems: "center",
    width: "100%",
  },

  pendingGamesContainer: {
    justifyContent: "flex-start", // Left-align children
    width: "100%",
    borderColor: "black", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  requestPlayerContainer: {
    alignItems: "flex-start",
    width: "100%",
    // borderWidth: 1, // Border width
    // borderColor: "blue", // Border color
    // borderRadius: 5, // Border radius (optional)
    // padding: 5, // Optional padding
  },

  requestPlayerButtonContainer: {
    alignItems: "center",
    width: "100%",
    // borderWidth: 1, // Border width
    // borderColor: "dark", // Border color
    // borderRadius: 5, // Border radius (optional)
    borderTopWidth: 2,
    borderTopColor: "black",
    borderTopStyle: "solid",
    padding: 16,
    padding: 5,
  },

  requestPlayerButton: {
    width: 385,
    borderRadius: 10,
    height: 100,
    backgroundColor: "#e04848",
    textAlign: "center",
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderColor: "dark green", // Border color
    borderRadius: 5, // Border radius (optional)
    margin: 5,
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
    borderRadius: 5, // Border radius (optional)
    padding: 2, // Optional padding
  },

  sportsPickerDropdown: {
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "dark green", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 2,
    margin: 2,
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

  managerBrowseGamesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  upcomingGameListContainer: {
    justifyContent: "flex-start", // Left-align children
    width: "100%",
    borderColor: "black", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  upcomingGameContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Left-align children
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  upcomingGameDateContainer: {
    justifyContent: "flex-start", // Left-align children
    borderColor: "red", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },
  upcomingGameAddressContainer: {
    flex: 1,
    justifyContent: "flex-start", // Left-align children
    borderColor: "red", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },
  welcomeScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  homeScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  welcomeScreenInputView: {
    backgroundColor: "white",
    borderRadius: 30,
    width: 250,
    height: 50,
    marginBottom: 20,
    alignItems: "center",
    borderColor: "black", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  welcomeScreenLogoContainer: {
    padding: 5, // Optional padding
    margin: 20,
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeButtonContainer: {
    marginTop: 40,
  },
  welcomeButton: {
    width: screenWidth - 50,
    color: "white",
    fontWeight: "500",
    height: 50,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d90e0e",
    textAlign: "center",
    textAlignVertical: "center",
  },
  gameInfo: {
    width: 385,
    borderRadius: 25,
    height: 50,
    marginBottom: 10,
    paddingTop: 15,
    borderColor: "red", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    textAlign: "center",
    justifyContent: "center",
  },
  profileLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Left-align children
    paddingLeft: "5%", // Optional padding
  },
});

export default Styles;
