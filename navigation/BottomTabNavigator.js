import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Health from "../tabs/HealthGoals";
import Food from "../tabs/FoodDatabase";
import Meal from "../tabs/MealPlanning";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Health" component={Health} />
        <Tab.Screen name="Food" component={Food} />
        <Tab.Screen name="Meal" component={Meal} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
