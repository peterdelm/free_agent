import { Dimensions, StyleSheet, Platform } from "react-native";

const screenWidth = Dimensions.get("window").width;

const { height } = Dimensions.get("window");
const inputHeight = height * 0.07; // Adjust the multiplier as needed

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
    verticalTextAlign: "center",
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
    padding: 10,
    flex: 1,
  },

  pendingScreenContainer: {
    alignItems: "flex-start",
    width: "100%",
    borderTopWidth: 2,
    borderTopColor: "black",
    borderTopStyle: "solid",
    borderBottomWidth: 2,
    borderBottomColor: "black",
    borderBottomStyle: "solid",
  },

  pendingContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },

  pendingGamesContainer: {
    justifyContent: "flex-start",
    flex: 1,
    width: "100%",
    borderColor: "black", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },
  upcomingGames: {
    height: "50%",
    borderColor: "black", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
  },

  requestPlayerContainer: {
    alignItems: "flex-start",
    width: "100%",
  },

  requestPlayerButtonContainer: {
    alignItems: "center",
    width: "100%",
    paddingBottom: Platform.select({
      ios: 80,
    }),
  },

  requestPlayerButton: {
    width: "95%",
    backgroundColor: "#e04848",
    textAlign: "center",
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5, // Border radius (optional)
    margin: 5,
  },

  requestPlayerButtonText: {
    fontSize: 20,
    paddingLeft: 10,
  },
  requestPlayerButtonImage: {
    width: "auto",
    height: "100%",
    resizeMode: "contain",
    padding: 20,
    margin: 10,
  },

  screenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Left-align children
    paddingLeft: "5%", // Optional padding
    paddingTop: "0%",
  },

  managerBrowseGamesContainerHeader: {
    alignItems: "center",
    padding: "2%",
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
    // borderRadius: 5, // Border radius (optional)
  },

  sportsPickerDropdown: {
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "#154734", // Border color
    borderRadius: 5, // Border radius (optional)
    margin: 2,
    backgroundColor: "#FFFFFF",
  },
  gameTypePickerDropdown: {
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "#154734", // Border color
    borderRadius: 5, // Border radius (optional)
    margin: 2,
    backgroundColor: "#FFFFFF",
  },
  input: {
    height: Platform.select({
      ios: inputHeight,
      android: inputHeight,
    }),
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
  },

  datePickerButton: {
    width: "100%",
    borderWidth: 1, // Border width
    borderColor: "dark green", // Border color
    borderRadius: 5, // Border radius (optional)
    padding: 10,
    margin: 2,
    backgroundColor: "#FFFFFF",
  },

  additionalInfo: {
    width: "100%",
    borderWidth: 1, // Border width
    borderRadius: 5, // Border radius (optional)
    padding: 5, // Optional padding
    backgroundColor: "#FFFFFF",
    paddingLeft: 20,
    alignItems: "center",
    margin: 2,
  },

  managerBrowseGamesContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",

    height: "100%",
  },

  managerBrowseGamesContentContainer: {
    width: "95%",
    flex: 1,

    justifyContent: "space-between",
  },

  upcomingGameListContainer: {
    justifyContent: "flex-start", // Left-align children
    width: "100%",
    flex: 1,
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
    justifyContent: "center",
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
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },

  welcomeScreenLogoContainer: {
    padding: 5,
    margin: 20,
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeButtonContainer: {
    marginTop: 40,
    lineHeight: Platform.select({
      ios: 20,
    }),
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
    lineHeight: Platform.select({
      ios: 50,
    }),
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
  profileLinksContainer: {
    width: "100%",
    alignItems: "center",
  },
  profileLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Left-align children
    paddingLeft: "5%", // Optional padding
    borderBottomColor: "gray", // Border color
    borderBottomWidth: 1, // Border width
    width: "90%",
    paddingTop: 15,
    paddingBottom: 15,
  },
  profileLinkTextContainer: {
    textAlign: "left",
    fontSize: 20,
  },
  profileLinkImageContainer: {
    textAlign: "left",
  },
  playerHomeContainer: { height: "100%", justifyContent: "space-between" },

  playerHomeContentContainer: {
    flex: 1,
    alignItems: "center",
  },

  playerHomeMapContainer: {
    width: "100%",
    height: "60%",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  playerHomeAvailableGamesContainer: {
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    flex: 1,
  },

  playerHomeTextContentContainer: {
    flex: 1,
    margin: 5,
    height: "50%",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goOfflineButtonContainer: {
    marginTop: 2,
    width: "100%",
    height: "20%",
  },
  goOfflineButton: {
    borderRadius: 10,
    backgroundColor: "#e04848",
    textAlign: "center",
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "red",
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
  },

  goOfflineButtonImage: {
    marginLeft: 20,
    height: "80%",
    borderColor: "red",
    borderRadius: 5,
    margin: 5,
  },

  goOfflineButtonText: {
    marginRight: 20,
    margin: 5,
  },
  playerHomeAvailableGamesHeader: {
    marginRight: 20,
    margin: 5,
  },
  availableGamesScroller: {
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    flex: 1,
    width: "100%",
  },
  viewGameContentContainer: { textAlign: "left", alignItems: "left" },
  userProfileContentContainer: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userProfileScreenContainer: {
    height: "100%",
  },
  responseMessage: {
    color: "green",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },

  // successBanner: {
  //   height: 20,
  // },
});

export default Styles;
