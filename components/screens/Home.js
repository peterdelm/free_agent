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

function HomeScreen({ navigation }) {
  return (
    <View style={Styles.container}>
      <Text>This is the home screen</Text>
      <TouchableOpacity>
        <Button
          title="CREATE GAME"
          onPress={() => navigation.navigate("CreateGame")}
        />
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
