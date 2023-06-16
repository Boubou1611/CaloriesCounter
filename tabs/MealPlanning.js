import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { DayName } from "../functions/dayName";
import { MealsWeek } from "../class/mealClass";

export default function MealPlanning({ navigation }) {
  //Components
  const Day = (props) => {
    const { navigation, dayName, dayMeals } = props;

    return (
      <View>
        <Text>{dayName}</Text>
        <View style={[Styles.container, Styles.horizontal]}>
          <View style={[Styles.meal]}>
            <Text>Breakfast</Text>
          </View>
          <View style={[Styles.meal]}>
            <Text>Lunch</Text>
          </View>
          <View style={[Styles.meal]}>
            <Text>Dinner</Text>
          </View>
          <View style={[Styles.meal]}>
            <Text>Snack</Text>
          </View>
          <TouchableOpacity
            style={[Styles.container, Styles.horizontal]}
            onPress={() => {
              navigation.navigate("Food Database", {
                dayToUpdate: dayName,
                dayMeals: dayMeals,
              });
            }}
          >
            <Text style={Styles.idText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [mealWeekPlan, setMealWeekPlan] = useState(new MealsWeek());
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //create variable mealPlanStorage to check if mealPlan exist
        const mealsWeekPlanStorage = await AsyncStorage.getItem(
          "mealsWeekPlanStorage"
        );
        console.log(
          "MealPlanning L56 mealsWeekPlanStorage:",
          mealsWeekPlanStorage
        );
        //create mealPlanStorage if not exist
        if (!mealsWeekPlanStorage) {
          await AsyncStorage.setItem(
            "mealsWeekPlanStorage",
            JSON.stringify(mealWeekPlan) //Objet of the class MealsWeek empty
          );
        }

        console.log(
          "MealPlanning L68 mealsWeekPlanStorage:",
          mealsWeekPlanStorage
        );

        const dayName = DayName();

        const weekData = JSON.parse(mealsWeekPlanStorage ?? "");
        setMealWeekPlan(weekData);
      } catch (error) {
        console.log("MealPlanning L77: get mealPlanStorage failed");
      }
    };
    fetchData();
  }, [isFocused]);

  return (
    <View style={Styles.container}>
      <View>
        <Text>{JSON.stringify(mealWeekPlan.days)}</Text>
      </View>
      <Day
        navigation={navigation}
        dayName="Monday"
        dayMeals={mealWeekPlan.days["Monday"]}
      ></Day>
      <Day
        navigation={navigation}
        dayName="Thursday"
        dayMeals={mealWeekPlan.days["Thursday"]}
      ></Day>
      <Day
        navigation={navigation}
        dayName="Wednesday"
        dayMeals={mealWeekPlan.days["Wednesday"]}
      ></Day>
      <Day
        navigation={navigation}
        dayName="Tuesday"
        dayMeals={mealWeekPlan.days["Tuesday"]}
      ></Day>
      <Day
        navigation={navigation}
        dayName="Friday"
        dayMeals={mealWeekPlan.days["Friday"]}
      ></Day>
      <Day
        navigation={navigation}
        dayName="Saturday"
        dayMeals={mealWeekPlan.days["Saturday"]}
      ></Day>
      <Day
        navigation={navigation}
        dayName="Sunday"
        dayMeals={mealWeekPlan.days["Sunday"]}
      ></Day>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  meal: { marginHorizontal: 5 },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
