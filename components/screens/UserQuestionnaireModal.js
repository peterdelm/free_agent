import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Keyboard,
  TextInput,
} from "react-native";
import React from "react";
import { Platform, Dimensions } from "react-native";
import { submitUserReview } from "../../api/apiCalls";
import { useEffect, useState } from "react";

const UserQuestionnairePopup = ({ isModalVisible, onClose }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isThankful, setIsThankful] = useState(false);

  const { height } = Dimensions.get("window");
  const inputHeight = height * 0.07;

  console.log("UserQuestionnaire Popup");
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [isThankful]);
  handleButtonPress = async () => {
    const result = await submitUserReview(additionalInfo);
    if (result.body.success) {
      console.log("Successful Result");
      onClose();
      setIsThankful(true);
    } else {
      console.log("Result", result);
    }
  };

  if (isThankful) {
    return (
      <Modal
        visible={isThankful}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: "20%" }]}>
            <Text style={styles.modalText}>Thanks for your feedback!</Text>
            <View //
              style={[
                {
                  flex: isKeyboardVisible ? 2 : 0,
                  height: isKeyboardVisible ? "100%" : null,
                  width: isKeyboardVisible ? "100%" : "100%",
                },
              ]}
            ></View>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                onPress={() => setIsThankful(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={
            isKeyboardVisible
              ? styles.modalContentKeyboard
              : styles.modalContent
          }
        >
          <Text
            style={
              isKeyboardVisible ? styles.modalTextKeyboard : styles.modalText
            }
          >
            Care to tell us why you cancelled your game?
          </Text>
          <View //
            style={[
              {
                flex: isKeyboardVisible ? 2 : 0,
                height: isKeyboardVisible ? "100%" : null,
                width: isKeyboardVisible ? "100%" : "100%",
              },
            ]}
          >
            <View //Input Container
              style={[
                isKeyboardVisible
                  ? {
                      borderWidth: 1,
                      borderRadius: 5,
                      height: "100%",
                    }
                  : {
                      height: Platform.select({
                        ios: inputHeight,
                        android: inputHeight,
                      }),
                      borderColor: "#154734",
                      borderRadius: 5,
                      borderWidth: 1,
                      overflow: "hidden",
                      justifyContent: "center",
                      flex: 0,
                      backgroundColor: "#FFFFFF",
                    },
              ]}
            >
              <TextInput
                style={[
                  isKeyboardVisible
                    ? {
                        padding: 10,
                        width: "100%",
                      }
                    : {
                        textAlign: "center",
                      },
                ]}
                onChangeText={setAdditionalInfo}
                value={additionalInfo}
              />
            </View>
          </View>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              onPress={handleButtonPress}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>No Thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    height: "40%",
  },
  modalContentKeyboard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    height: "90%",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
  modalTextKeyboard: {
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonsContainer: {},
  modalButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
});

export default UserQuestionnairePopup;
