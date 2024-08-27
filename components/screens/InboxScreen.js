import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationFooter from "./NavigationFooter";
import formatDate from "./formatDate";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import getCurrentUser from "./getCurrentUser.helper";

const InboxScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      };
      fetchCurrentUser();
    }, [])
  );
  return (
    <View style={Styles.managerBrowseGamesContainer}>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          width: "100%",
        }}
      >
        <View style={Styles.screenHeader}>
          <Image
            source={require("../../assets/chat-regular.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 35, padding: 20 }}>Inbox</Text>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 25, paddingBottom: 400 }}>
          No Messages Yet...
        </Text>
      </View>
      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
};

export default InboxScreen;
