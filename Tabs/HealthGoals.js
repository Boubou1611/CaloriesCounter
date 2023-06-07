import { StatusBar } from 'expo-status-bar';
import { View, TextInput, Text, Switch, Button, Alert, StyleSheet  } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [numberOfPets, setNumberOfPets] = useState("");
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [age, setAge] = useState("");
const handleNameChange = (text) => {
  setName(text);
};

const handleDateOfBirthChange = (event, selectedDate) => {
  const currentDate = selectedDate || dateOfBirth;
  setDateOfBirth(currentDate);
  calculateAge(currentDate);
};

const handleNumberOfPetsChange = (text) => {
  setNumberOfPets(text);
};

const handleDeveloperSwitchChange = (value) => {
  setIsDeveloper(value);
};

const handleAgreedCheckboxChange = (value) => {
  setIsAgreed(value);
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const diff = today - birthDate;
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  setAge(age.toString());
};

const handleSubmit = () => {
  if (!name || name.length < 3) {
    Alert.alert("Error", "Name should contain at least 3 characters");
    return;
  }
  if (dateOfBirth > new Date()) {
    Alert.alert("Error", "Date of Birth cannot be a future date");
    return;
  }
  if (!isAgreed) {
    Alert.alert("Error", "You must agree to the rules before submitting");
    return;
  }

  // If all validations pass, display the form information
  const message = `Name: ${name}\nDate of Birth: ${dateOfBirth.toDateString()}\nAge: ${age}\nNumber of Pets: ${numberOfPets}\nReact Native Developer: ${
    isDeveloper ? "Yes" : "No"
  }`;

  Alert.alert("Form Submitted", message);
};

return (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Name"
      onChangeText={handleNameChange}
      value={name}
      maxLength={30}
    />
    <DateTimePicker
      value={dateOfBirth}
      mode="date"
      onChange={handleDateOfBirthChange}
      maximumDate={new Date()}
    />
    <TextInput
      style={styles.input}
      placeholder="Number of Pets"
      onChangeText={handleNumberOfPetsChange}
      value={numberOfPets}
      keyboardType="numeric"
      maxLength={2}
    />
    <View style={styles.switchContainer}>
      <Switch value={isDeveloper} onValueChange={handleDeveloperSwitchChange} />
      <Text style={styles.switchText}>I'm a great React Native developer</Text>
    </View>
    <View style={styles.switchContainer}>
      <Checkbox value={isAgreed} onValueChange={handleAgreedCheckboxChange} />
      <Text style={styles.switchText}>
        I understand the rules of the project and I'll do my best
      </Text>
    </View>
    <Button title="Submit" onPress={handleSubmit} disabled={!name || !dateOfBirth || !isAgreed} />
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 20,
},
input: {
  width: "100%",
  height: 40,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  marginBottom: 10,
  paddingHorizontal: 10,
},
switchContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},
switchText: {
  marginLeft: 10,
},
});
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>C'est les HealthGoals oue ouee</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
