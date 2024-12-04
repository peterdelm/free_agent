import React, { useState, useEffect, useRef, memo } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Styles from "./Styles";
const AddressInput = memo(
  ({ handleLocationSelected, resetTrigger, defaultLocation }) => {
    const [playerAddress, setPlayerAddress] = useState(defaultLocation || "");

    // Clear input when resetTrigger changes
    useEffect(() => {
      if (resetTrigger) {
        setPlayerAddress(""); // Reset address text
      }
    }, [resetTrigger]);

    return (
      <GooglePlacesAutocomplete
        placeholder={playerAddress || "Enter Location"}
        onPress={(data, details = null) => {
          const locationName = details.name;
          const formattedAddress = details.formatted_address;
          setPlayerAddress(formattedAddress);
          handleLocationSelected({
            address: data.description,
            locationName: locationName,
            formattedAddress: formattedAddress,
          });
        }}
        query={{
          key: "AIzaSyDof22OsH_HsjBC9sS9NnsAC3o9IfVfqmA",
          language: "en",
          components: "country:ca",
        }}
        fetchDetails={true} // Fetch additional details for the selected location
        enablePoweredByContainer={false} // Hide the Google logo if desired
        styles={{
          container: {
            flex: 0,
            width: "100%",
          },
          listView: {
            position: "absolute",
            top: 50, // Adjust based on your layout
            zIndex: 1000, // Ensure it's on top of other elements
            width: "100%",
          },
          textInputContainer: [
            Styles.sportsPickerDropdown,
            { borderWidth: 0, paddingTop: 2, marginBottom: 0 },
          ],
          textInput: Styles.input, // Apply your input styles here
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
        }}
        textInputProps={{
          value: playerAddress, // Bind input field value to state
          onChangeText: setPlayerAddress, // Update state when text changes
        }}
      />
    );
  }
);

export default AddressInput;
