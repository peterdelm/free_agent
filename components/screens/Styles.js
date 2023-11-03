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
});

export default Styles;
