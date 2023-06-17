import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const PickerGender = () => {
  const [pickerSelectedValue, setPickerSelectedValue] = useState("");
  const [gender, setGender] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);

  const handleGenderChange = (itemValue) => {
    setSelectedGender(itemValue);
  };

  return (
    <View>
      <Picker
        selectedValue={pickerSelectedValue}
        onValueChange={(itemValue, itemIndex) =>
          setPickerSelectedValue(itemValue)
        }
        style={{ height: "100%", width: "100%" }}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
    </View>
  );
};
const Styles = StyleSheet.create({
  itemView: {
    borderRadius: "25px",
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    verticalAlign: "middle",
    backgroundColor: "#daf2da",
    marginVertical: 10,
  },
});
export default PickerGender;

// <Text>Sélectionnez votre genre :</Text>
// <Picker
//   selectedValue={selectedGender}
//   onValueChange={handleGenderChange}
// >
//   <Picker.Item label="Homme" value="Male" />
//   <Picker.Item label="Femme" value="Female" />
//   <Picker.Item label="Autre" value="Other" />
// </Picker>
// <Text>Votre genre : {selectedGender}</Text>
