import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  ViewComponent,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { MealsWeek } from "../class/mealClass";

export default function MealPlanning({ navigation }) {
  //Components
  const Day = (props) => {
    const { navigation, dayName, dayMeals } = props;
    return (
      <View style={[Styles.dayContainer, Styles.vertical]}>
        <Text>{dayName.toUpperCase()}</Text>
        <DayStat dayMeals={dayMeals} />
        <View style={[Styles.dayContent]}>
          {Object.keys(dayMeals).map((meal, mealKey) => {
            return (
              <View style={[Styles.mealContainer]} key={mealKey}>
                <View style={[Styles.mealContent]}>
                  <Text style={[Styles.mealText]}>
                    {capitalizeFirstChar(meal)}
                  </Text>
                  {dayMeals[meal].map((Food, key) => {
                    const food = {
                      foodId: Food._id,
                      mealName: meal,
                      dayName: dayName,
                    };
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setIsModalDisplay(true);
                          setFoodToRemove(food);
                        }}
                        key={key + Food._id}
                      >
                        <Text style={[Styles.foodText]} key={Food._id}>
                          {Food.quantity +
                            " X " +
                            "(" +
                            Food.calories +
                            " cal) :" +
                            Food.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <MealStat dayMeals={dayMeals} meal={meal} />
              </View>
            );
          })}

          <TouchableOpacity
            style={[Styles.touchContainer, Styles.horizontal]}
            onPress={() => {
              navigation.navigate("Food", {
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
  const DayStat = (props) => {
    const { dayMeals } = props;
    let mealCalories = 0;
    {
      Object.keys(dayMeals).map((meal) => {
        dayMeals[meal].map((Food) => {
          mealCalories = mealCalories + Food.calories * Food.quantity;
        });
      });
    }
    return (
      <Text>
        {mealCalories + " "}
        Tot.Cal
      </Text>
    );
  };
  const MealStat = (props) => {
    const { dayMeals, meal } = props;
    let mealCalories = 0;
    return (
      <View style={Styles.mealStats}>
        {dayMeals[meal].map((Food) => {
          mealCalories = mealCalories + Food.calories * Food.quantity;
        })}
        {mealCalories > 0 ? (
          <Text style={[Styles.statText]}>
            {mealCalories + " "}
            Tot.Cal
          </Text>
        ) : null}
      </View>
    );
  };
  const Modal = (props) => {
    const { mealWeekPlan, foodToRemove } = props;
    console.log("MealPlanning L97 foodToRemove:", foodToRemove);
    return (
      <View style={[Styles.modal]}>
        <TouchableOpacity
          style={Styles.selectButton}
          onPress={() => {
            setIsModalDisplay(false);
            RemoveFood(mealWeekPlan, foodToRemove);
          }}
        >
          <Text style={Styles.searchButtonText}>Remove Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.selectButton}
          onPress={() => {
            setIsModalDisplay(false);
          }}
        >
          <Text style={Styles.searchButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };
  //States
  const [mealWeekPlan, setMealWeekPlan] = useState(new MealsWeek());
  const [foodToRemove, setFoodToRemove] = useState({
    foodId: "",
    mealName: "",
    dayName: "",
  });
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const isFocused = useIsFocused();
  //functions
  const RemoveFood = async (mealWeekPlan, foodToRemove) => {
    //find object index of the _id food in mealWeekPlan
    const foundIndex = mealWeekPlan.days[foodToRemove.dayName][
      foodToRemove.mealName
    ].findIndex((item) => item._id === foodToRemove.foodId);

    if (foundIndex !== -1) {
      // Delete this object
      mealWeekPlan.days[foodToRemove.dayName][foodToRemove.mealName].splice(
        foundIndex,
        1
      );
      //update local storage
      await AsyncStorage.setItem(
        "mealsWeekPlanStorage",
        JSON.stringify(mealWeekPlan)
      );
    } else {
      console.log(
        "MealPlanning L161 removeFood L'objet avec l'ID recherché n'a pas été trouvé."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        //create variable mealPlanStorage to check if mealPlan exist
        const mealsWeekPlanStorage = await AsyncStorage.getItem(
          "mealsWeekPlanStorage"
        );

        //create mealPlanStorage if not exist
        if (!mealsWeekPlanStorage) {
          await AsyncStorage.setItem(
            "mealsWeekPlanStorage",
            JSON.stringify(mealWeekPlan) //Objet of the class MealsWeek empty
          );
        }
        //transform the string to an object
        const weekData = JSON.parse(mealsWeekPlanStorage ?? "");
        //set the data to render
        setMealWeekPlan(weekData);
      } catch (error) {
        alert(`Une erreur est survenue 🧘‍♀️`);
        console.log(
          "MealPlanning L195  UseEffect : get mealPlanStorage failed"
        );
      }
    };
    fetchData();
  }, [isFocused]);

  return (
    <ScrollView bounces="true" style={Styles.scrollContainer}>
      <View style={Styles.container}>
        {Object.keys(mealWeekPlan.days).map((day, key) => {
          return (
            <Day
              navigation={navigation}
              dayName={day}
              dayMeals={mealWeekPlan.days[day]}
              key={key}
            ></Day>
          );
        })}
        {isModalDisplay ? (
          <Modal
            style={[Styles.modal]}
            foodToRemove={foodToRemove}
            mealWeekPlan={mealWeekPlan}
          ></Modal>
        ) : null}
      </View>
    </ScrollView>
  );
}

function capitalizeFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Styles = StyleSheet.create({
  scrollContainer: {
    position: "relative",
    height: 10,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  touchContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    position: "absolute",
    top: "40%",
    width: "50%",
    height: "30%",
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  vertical: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },

  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dayContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  mealContainer: {
    marginHorizontal: 5,
    width: "20%",
    justifyContent: "space-between",
  },
  mealContent: {
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  mealStats: { position: "relative", bottom: 0 },

  idText: { fontSize: 10 },
  mealText: { fontSize: 12 },
  foodText: { fontSize: 8, marginBottom: 5 },
  statText: { fontSize: 10, fontWeight: "bold" },
});
