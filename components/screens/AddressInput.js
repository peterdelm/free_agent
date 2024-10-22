import React, { useState, useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
navigator.geolocation = require("react-native-geolocation-service");
import Styles from "./Styles";

const AddressInput = ({
  handleLocationSelected,
  resetTrigger,
  defaultLocation,
}) => {
  // onPress = { handleLocationSelected };

  const googlePlacesRef = useRef(null);

  // Clear the input field when resetTrigger changes
  React.useEffect(() => {
    if (resetTrigger && googlePlacesRef.current) {
      googlePlacesRef.current.setAddressText(""); // Clear the input text
    }
  }, [resetTrigger]);

  return (
    <GooglePlacesAutocomplete
      ref={googlePlacesRef} // Attach ref to the component
      placeholder={defaultLocation ? defaultLocation : "Enter Location"}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        handleLocationSelected(data, details);
        console.log(data, details);
      }}
      query={{
        key: "AIzaSyDof22OsH_HsjBC9sS9NnsAC3o9IfVfqmA",
        language: "en",
        components: "country:ca",
      }}
      fetchDetails={true}
      enablePoweredByContainer={false}
      styles={{
        container: {
          flex: 0,
        },
        listView: {
          position: "absolute",
          top: 50,
          zIndex: 1000,
        },

        textInputContainer: [
          Styles.sportsPickerDropdown,
          { borderWidth: 0, paddingTop: 2, marginBottom: 0 },
        ],
        textInput: Styles.input,
        predefinedPlacesDescription: {
          color: "#1faadb",
        },
      }}
    />
  );
};

export default AddressInput;
