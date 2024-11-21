import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { EXPO_PUBLIC_BASE_URL } from "../../.config.js";
import authFetch from "../../api/authCalls.js";
import NavigationFooter from "./NavigationFooter";
import { StyleSheet } from "react-native-web";
import DeletePlayerPopup from "./DeletePlayerPopup"; // Adjust import path as needed
function ViewUser({ navigation }) {
  const route = useRoute();
  const { userId } = route.params;
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [refreshPlayers, setRefreshPlayers] = useState(false);
  const { refresh } = route.params || {};
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State to track deletion status

  // useEffect(() => {
  //   if (refresh) {
  //     setRefreshPlayers(true);
  //   }
  // }, [refresh]);

  console.log("ViewUser has received the call!");

  useEffect(() => {
    console.log("ViewUser with userId", userId);

    const fetchData = async () => {
      try {
        const url = `${EXPO_PUBLIC_BASE_URL}api/users/${userId}`;
        const headers = {
          "Content-Type": "application/json",
        };

        const requestOptions = {
          headers,
        };

        const res = await authFetch(url, requestOptions);

        if (res.status === 200) {
          console.log(res);
          const userData = res.body.user;
          setUser(userData);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.log("Error fetching player data:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, refreshPlayers]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const url = `${EXPO_PUBLIC_BASE_URL}api/users/${userId}`;
          const headers = {
            "Content-Type": "application/json",
          };

          const requestOptions = {
            headers,
          };

          const res = await authFetch(url, requestOptions);

          if (res.status === 200) {
            console.log(res);
            const userData = res.body.user;
            setUser(userData);
          } else {
            throw new Error("Network response was not ok.");
          }
        } catch (error) {
          console.log("Error fetching player data:", error);
          // Handle error
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [refreshPlayers])
  );

  const handleDeletePlayerButtonPress = async () => {
    try {
      setIsDeleting(true);
      await deletePlayer();
      console.log("Player deleted successfully");
      // Optionally navigate or update UI
    } catch (error) {
      console.error("Error deleting player:", error);
    } finally {
      setIsDeleting(false);
      setModalVisible(false); // Close the modal after deletion
    }
  };

  const deletePlayer = async () => {
    try {
      const url = `${EXPO_PUBLIC_BASE_URL}api/players/${userId}`;
      const headers = {
        "Content-Type": "application/json",
      };

      const requestOptions = {
        method: "DELETE",
        headers,
      };

      const res = await authFetch(url, requestOptions);
      if (res.status === 200) {
        console.log("User deleted successfully.");
        navigation.navigate("ManagePlayers", { refresh: true });
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.log("Error deleting player:", error);
      // Handle error
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  // Function to open the modal
  const openModal = () => setModalVisible(true);

  // Function to close the modal
  const closeModal = () => setModalVisible(false);
  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          flex: 0,
          alignItems: "center",
          width: "100%",
        }}
      >
        <View style={Styles.screenHeader}>
          <Text style={{ fontSize: 35, padding: 20 }}>USER PROFILE</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "96%",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text style={viewPlayerStyles.text}>
            <Text style={{ fontWeight: "bold" }}>
              Name:
              {" " + user.firstName + " " + user.lastName}
            </Text>
          </Text>

          <Text style={viewPlayerStyles.text}>
            <Text style={{ fontWeight: "bold" }}>Email: {user.email}</Text>
          </Text>
        </View>
        <TouchableOpacity
        //   onPress={() =>
        //     navigation.navigate("EditPlayer", {
        //       userId: user.id,
        //       playerSport: player.sport,
        //     })
        //   }
        >
          <Text
            style={[
              Styles.input,
              (style = {
                fontSize: 20,
                textAlign: "center",
                textAlignVertical: "center",
                lineHeight: Platform.select({
                  ios: 50,
                }),
                margin: 20,
              }),
            ]}
          >
            Edit User (*INACTIVE*)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openModal}>
          <Text
            style={[
              Styles.input,
              (style = {
                fontSize: 20,
                textAlign: "center",
                textAlignVertical: "center",
                lineHeight: Platform.select({
                  ios: 50,
                }),
                margin: 20,
              }),
            ]}
          >
            Delete User (*INACTIVE*)
          </Text>
        </TouchableOpacity>
        <DeletePlayerPopup
          isModalVisible={isModalVisible}
          // handleButtonPress={handleDeletePlayerButtonPress} **INACTIVE, NEEDS TO BE HOOKED UP TO A DELETE USER FUNCTION
          onClose={closeModal}
        />
      </View>
      <NavigationFooter navigation={navigation}>
        <Text>FOOTER</Text>
      </NavigationFooter>
    </View>
  );
}

const viewPlayerStyles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: "left",
    lineHeight: Platform.select({
      ios: 50,
    }),
    padding: 10,
  },
});

export default ViewUser;
