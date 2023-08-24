import { StatusBar } from "expo-status-bar";
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
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Styles from "./Styles";

const CreatePlayer = ({ navigation }) => {
  return (
    <View style={Styles.container}>
      <View style={Styles.homeContainer}>
        <Text style={Styles.primaryButton}>Create a Player Profile Here</Text>
      </View>
    </View>
  );
};

export default CreatePlayer;
