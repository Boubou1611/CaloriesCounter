import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpaicty } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";

import Health from "../tabs/HealthGoals";
import Food from "../tabs/FoodDatabase";
import Meal from "../tabs/MealPlanning";
import { NavigationContainer } from "@react-navigation/native";
import { shadow } from "react-native-paper";

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const getTabBarOptions = (icon, label) => ({
  tabBarIcon: ({ focused }) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        top: 10,
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          marginTop: 10,
          width: 25,
          height: 25,
          tintColor: focused ? "#12db12" : "#137d13",
        }}
      />
      <Text
        style={{
          marginTop: 5,
          color: focused ? "#12db12" : "#137d13",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </View>
  ),
});

const BottomTabNavigator = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerStyle: { backgroundColor: "#0d0f0d" },
          headerTintColor: "#137d13",
          headerTitleStyle: { fontWeight: "bold" },
          tabBarStyle: {
            position: "absolute",
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: "#0d0f0d",
            borderRadius: 15,
            height: 90,
            ...styles.shadow,
          },
        }}
      >
        <Tab.Screen
          name="Health"
          component={Health}
          options={getTabBarOptions(require("../assets/home.png"), "HOME")}
        />
        <Tab.Screen
          name="Food"
          component={Food}
          options={getTabBarOptions(require("../assets/vege-food.png"), "FOOD")}
        />
        <Tab.Screen
          name="Meal"
          component={Meal}
          options={getTabBarOptions(require("../assets/clock.png"), "PLANNING")}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#deffde",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
