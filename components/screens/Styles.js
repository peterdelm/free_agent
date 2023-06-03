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
});

export default Styles;
