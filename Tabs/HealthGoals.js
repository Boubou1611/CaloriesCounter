import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, TouchableWithoutFeedback, Text, Alert, Keyboard } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import {Checkbox} from "expo-checkbox";

const ActivityLevels = [
  { name: 'Sedentary', value: 'sedentary' },
  { name: 'Light Exercise', value: 'light_exercise' },
  { name: 'Moderate Exercise', value: 'moderate_exercise' },
  { name: 'Heavy Exercise', value: 'heavy_exercise' },
  { name: 'Extra Active', value: 'extra_active' },
];

const Goals = [
  { name: 'Weight Loss', value: 'weight_loss' },
  { name: 'Weight Maintenance', value: 'weight_maintenance' },
  { name: 'Weight Gain', value: 'weight_gain' },
];

const GenderChoices = ['Male', 'Female'];

const HealthGoals = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(GenderChoices[0]);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState(ActivityLevels[0].value);
  const [goal, setGoal] = useState(Goals[0].value);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showActivityLevelPicker, setShowActivityLevelPicker] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [bmr, setBMR] = useState(null);
  const [calories, setCalories] = useState(null);


  const handleGenderPickerPress = () => {
    setShowGenderPicker(true);
  };

  const handleActivityLevelPickerPress = () => {
    setShowActivityLevelPicker(true);
  };

  const handleGoalPickerPress = () => {
    setShowGoalPicker(true);
  };

  const handleGenderPickerChange = (itemValue) => {
    setGender(itemValue);
    setShowGenderPicker(false);
  };

  const handleActivityLevelPickerChange = (itemValue) => {
    setActivityLevel(itemValue);
    setShowActivityLevelPicker(false);
  };

  const handleGoalPickerChange = (itemValue) => {
    setGoal(itemValue);
    setShowGoalPicker(false);
  };

  const handleAgreedCheckboxChange = (value) => {
    setIsAgreed(value);
  };
  const calculateBMR = () => {
    let bmr = 0;
    if (gender === 'Male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else if (gender === 'Female') {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
    }
  
    let adjustedBMR = 0;
    switch (activityLevel) {
      case 'sedentary':
        adjustedBMR = bmr * 1.2;
        break;
      case 'light_exercise':
        adjustedBMR = bmr * 1.375;
        break;
      case 'moderate_exercise':
        adjustedBMR = bmr * 1.55;
        break;
      case 'heavy_exercise':
        adjustedBMR = bmr * 1.725;
        break;
      case 'extra_active':
        adjustedBMR = bmr * 1.9;
        break;
      default:
        adjustedBMR = bmr;
        break;
    }
  
    return adjustedBMR;
  };


  const calculateCalories = () => {
    const bmr = calculateBMR();
    if (bmr !== null) {
      let adjustedBMR = 0;
      switch (activityLevel) {
        case 'sedentary':
          adjustedBMR = bmr * 1.2;
          break;
        case 'light_exercise':
          adjustedBMR = bmr * 1.375;
          break;
        case 'moderate_exercise':
          adjustedBMR = bmr * 1.55;
          break;
        case 'heavy_exercise':
          adjustedBMR = bmr * 1.725;
          break;
        case 'extra_active':
          adjustedBMR = bmr * 1.9;
          break;
        default:
          adjustedBMR = bmr;
          break;
      }

      let adjustedCalories = adjustedBMR;
      switch (goal) {
        case 'weight_loss':
          adjustedCalories = adjustedBMR * 0.9; // Subtract 10% for weight loss
          break;
        case 'weight_gain':
          adjustedCalories = adjustedBMR * 1.1; // Add 10% for weight gain
          break;
        default:
          break;
      }

      return adjustedCalories;
    }
    return null;
  };


  const handleSubmit = () => {
    
    if (!name || name.length < 3) {
      Alert.alert("Error", "Name should contain at least 3 characters");
      return;
    }
    if (age < 15) {
      Alert.alert("Error", "You must be at least 15");
      return;
    }
    if (!isAgreed) {
      Alert.alert("Error", "You must agree to the rules before submitting");
      return;
    }
  
    // If all validations pass, display the form information
    const message = `Name: ${name}\nAge: ${age}\nHeight ${height}\nWeight ${weight}
    \nGender ${gender}\nActivity Level: ${activityLevel}\nGoal: ${goal}`;
    const calculatedBMR = calculateBMR();
      if (calculatedBMR !== null) {
        setBMR(calculatedBMR);
      }
    const calculatedCalories = calculateCalories();
      setCalories(calculatedCalories);
  
    Alert.alert("Form Submitted", message);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
  
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Height"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>
  
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
        </View>
  
        <TouchableWithoutFeedback onPress={handleGenderPickerPress}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerText}>{gender}</Text>
          </View>
        </TouchableWithoutFeedback>
  
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />
  
        <TouchableWithoutFeedback onPress={handleActivityLevelPickerPress}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerText}>
              {ActivityLevels.find((level) => level.value === activityLevel)?.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
  
        <TouchableWithoutFeedback onPress={handleGoalPickerPress}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerText}>
              {Goals.find((item) => item.value === goal)?.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
  
        <Button title="Submit" onPress={handleSubmit} />
  
        <Modal visible={showGenderPicker} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={handleGenderPickerChange}
              style={styles.picker}
            >
              {GenderChoices.map((choice) => (
                <Picker.Item key={choice} label={choice} value={choice} />
              ))}
            </Picker>
          </View>
        </Modal>
  
        <Modal visible={showActivityLevelPicker} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={activityLevel}
              onValueChange={handleActivityLevelPickerChange}
              style={styles.picker}
            >
              {ActivityLevels.map((level) => (
                <Picker.Item key={level.value} label={level.name} value={level.value} />
              ))}
            </Picker>
          </View>
        </Modal>
  
        <Modal visible={showGoalPicker} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <Picker
              selectedValue={goal}
              onValueChange={handleGoalPickerChange}
              style={styles.picker}
            >
              {Goals.map((goal) => (
                <Picker.Item key={goal.value} label={goal.name} value={goal.value} />
              ))}
            </Picker>
          </View>
        </Modal>
  
        <View style={styles.switchContainer}>
          <Checkbox value={isAgreed} onValueChange={handleAgreedCheckboxChange} />
          <Text style={styles.switchText}>
            I confirm that my information is correct
          </Text>
        </View>
  
        {calories !== null && (
          <Text style={styles.resultText}>
            Total Caloric Intake: {calories.toFixed(2)} calories per day
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#212121',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginRight: 5,
    color : 'black',
    backgroundColor: 'white',
    borderRadius: 10, 
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontWeight: "bold",
    backgroundColor: 'white',
    borderRadius: 10, 
  },
  pickerContainer: {
    height: 40,
    width: '50%',
    borderColor: 'green',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'green',
    borderRadius: 10, 
  },
  pickerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  picker: {
    backgroundColor: 'white',
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    color:'white',
  },
  switchText: {
    color: 'white',
  },
  bmrText: {
    marginTop: 20,
    fontSize: 16,
    color: 'white',
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    color: 'white',
    fontWeight: "bold",
  },
});

export default HealthGoals;