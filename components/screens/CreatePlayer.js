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

const CreatePlayer = ({ navigation }) => {
  return (
    <View style={Styles.container}>
      {<Banner message={successMessage} />}
      <View style={Styles.homeContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("CreateGame")}>
          <Text style={Styles.primaryButton}>Find a Goalie</Text>
        </TouchableOpacity>
        <ScrollView>
          {allActiveGames.length > 0 ? allActiveGames : noActiveGames}
        </ScrollView>
      </View>
    </View>
  );
};

export default CreatePlayer;
