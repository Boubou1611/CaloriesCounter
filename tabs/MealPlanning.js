import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { MealsWeek } from "../class/mealClass";

export default function TabThreeScreen({ navigation }) {
  //Components
  const Day = (props) => {
    const { navigation, dayName, dayMeals } = props;
    return (
      <View style={[Styles.dayContainer, Styles.vertical]}>
        <View style={Styles.dayNameContainer}>
          <Text style={Styles.dayName}>{dayName.toUpperCase()}</Text>
          <DayStat dayMeals={dayMeals} />
        </View>

        <View style={[Styles.dayContent]}>
          {Object.keys(dayMeals).map((meal, mealKey) => {
            return (
              <View
                style={[Styles.mealContainer]}
                key={mealKey + "mealContainer"}
              >
                <View
                  style={[Styles.mealContent]}
                  key={mealKey + "mealContent"}
                >
                  <View style={[Styles.horizontal]}>
                    <Text style={[Styles.mealText]} key={mealKey + "mealText"}>
                      {capitalizeFirstChar(meal)} :
                    </Text>
                    <MealStat dayMeals={dayMeals} meal={meal} />
                  </View>

                  <View
                    style={[Styles.vignetteContainer]}
                    key={mealKey + "vignetteContainer"}
                  >
                    <ScrollView horizontal>
                      {dayMeals[meal].map((Food, key) => {
                        const food = {
                          foodId: Food._id,
                          foodImage: Food.picture,
                          foodQuantity: Food.quantity,
                          foodCalories: Food.calories,
                          mealName: meal,
                          dayName: dayName,
                        };
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setIsModalDisplay(true);
                              setfoodToChange(food);
                            }}
                            key={key + Food._id}
                          >
                            <View
                              style={Styles.imageFoodContainer}
                              key={"view" + Food._id}
                            >
                              <Image
                                style={Styles.picture}
                                source={{ url: Food.picture }}
                                key={"image" + Food._id}
                              />
                              <View
                                style={Styles.vignetteText}
                                key={"vignette" + Food._id}
                              >
                                <Text style={[Styles.foodText]} key={Food._id}>
                                  {Food.quantity +
                                    " X " +
                                    "(" +
                                    Food.calories +
                                    " cal)"}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <TouchableOpacity
          style={[Styles.addButton, Styles.horizontal]}
          onPress={() => {
            navigation.navigate("Food", {
              dayToUpdate: dayName,
              dayMeals: dayMeals,
            });
          }}
        >
          <Text style={Styles.buttonText}>+</Text>
        </TouchableOpacity>
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
      <Text style={Styles.caloriesText}>
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
    const { mealWeekPlan, foodToChange } = props;
    // console.log("MealPlanning L97 foodToChange:", foodToChange);
    return (
      <View style={[Styles.modal]}>
        <View style={Styles.imageFoodContainer}>
          <Image
            style={Styles.modalePicture}
            source={{ url: foodToChange.foodImage }}
          />
        </View>
        <View style={[Styles.changeQuantityContainer, Styles.horizontal]}>
          <TouchableOpacity
            style={Styles.changeQuantityButton}
            onPress={() => {
              AddQuantity(mealWeekPlan, foodToChange);
            }}
          >
            <Text style={Styles.changeButtonText}>+</Text>
          </TouchableOpacity>
          <View>
            <Text style={[Styles.modalFoodText]}>
              {foodToChange.foodQuantity +
                " X " +
                "(" +
                foodToChange.foodCalories +
                " cal)"}
            </Text>
          </View>
          {foodToChange.foodQuantity > 0 ? (
            <TouchableOpacity
              style={Styles.changeQuantityButton}
              onPress={() => {
                RemoveQuantity(mealWeekPlan, foodToChange);
              }}
            >
              <Text style={Styles.changeButtonText}>-</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={[Styles.horizontal, Styles.commandButtonContainer]}>
          <TouchableOpacity
            style={Styles.commandButton}
            onPress={() => {
              setIsModalDisplay(false);
              RemoveFood(mealWeekPlan, foodToChange);
            }}
          >
            <Text style={Styles.searchButtonText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.commandButton}
            onPress={() => {
              setIsModalDisplay(false);
            }}
          >
            <Text style={Styles.searchButtonText}>Valid</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  //States
  const [mealWeekPlan, setMealWeekPlan] = useState(new MealsWeek());
  const [foodToChange, setfoodToChange] = useState({
    foodId: "",
    foodCalories: "",
    foodQuantity: "",
    mealName: "",
    dayName: "",
  });
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const isFocused = useIsFocused();
  const { width, height } = Dimensions.get("window");
  //functions
  const RemoveFood = async (mealWeekPlan, foodToChange) => {
    //find object index of the _id food in mealWeekPlan
    const foundIndex = mealWeekPlan.days[foodToChange.dayName][
      foodToChange.mealName
    ].findIndex((item) => item._id === foodToChange.foodId);

    if (foundIndex !== -1) {
      // Delete this object
      mealWeekPlan.days[foodToChange.dayName][foodToChange.mealName].splice(
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
  const AddQuantity = async (mealWeekPlan, foodToChange) => {
    //find object index of the _id food in mealWeekPlan
    const foundIndex = mealWeekPlan.days[foodToChange.dayName][
      foodToChange.mealName
    ].findIndex((item) => item._id === foodToChange.foodId);

    if (foundIndex !== -1) {
      const newQuantity =
        mealWeekPlan.days[foodToChange.dayName][foodToChange.mealName][
          foundIndex
        ].quantity + 1;

      mealWeekPlan.days[foodToChange.dayName][foodToChange.mealName][
        foundIndex
      ].quantity = newQuantity;

      let newfoodToChange = { ...foodToChange };

      newfoodToChange.foodQuantity = newQuantity;

      setfoodToChange(newfoodToChange);
      //update local storage
      await AsyncStorage.setItem(
        "mealsWeekPlanStorage",
        JSON.stringify(mealWeekPlan)
      );
    } else {
      console.log(
        "MealPlanning L234 AddQuantity L'objet avec l'ID recherché n'a pas été trouvé."
      );
    }
  };
  const RemoveQuantity = async (mealWeekPlan, foodToChange) => {
    //find object index of the _id food in mealWeekPlan
    const foundIndex = mealWeekPlan.days[foodToChange.dayName][
      foodToChange.mealName
    ].findIndex((item) => item._id === foodToChange.foodId);

    if (foundIndex !== -1) {
      const newQuantity =
        mealWeekPlan.days[foodToChange.dayName][foodToChange.mealName][
          foundIndex
        ].quantity - 1;

      mealWeekPlan.days[foodToChange.dayName][foodToChange.mealName][
        foundIndex
      ].quantity = newQuantity;

      let newfoodToChange = { ...foodToChange };

      newfoodToChange.foodQuantity = newQuantity;

      setfoodToChange(newfoodToChange);
      //update local storage
      await AsyncStorage.setItem(
        "mealsWeekPlanStorage",
        JSON.stringify(mealWeekPlan)
      );
    } else {
      console.log(
        "MealPlanning L234 AddQuantity L'objet avec l'ID recherché n'a pas été trouvé."
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
    <View style={Styles.container}>
      <ScrollView pagingEnabled horizontal style={{ width, height }}>
        {Object.keys(mealWeekPlan.days).map((day, key) => {
          return (
            <View style={{ width, height }} key={key}>
              <Day
                navigation={navigation}
                dayName={day}
                dayMeals={mealWeekPlan.days[day]}
              />
            </View>
          );
        })}
      </ScrollView>
      {isModalDisplay ? (
        <Modal
          style={[Styles.modal]}
          foodToChange={foodToChange}
          mealWeekPlan={mealWeekPlan}
        ></Modal>
      ) : null}
    </View>
  );
}

function capitalizeFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#212121",
  },
  vignetteContainer: {
    width: 380,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
  },
  changeQuantityContainer: { width: "80%" },
  commandButtonContainer: {
    width: "100%",
    paddingHorizontal: 15,
  },
  modal: {
    position: "absolute",
    top: "40%",
    width: "50%",
    height: "30%",
    backgroundColor: "white",
    flex: 1,
    justifyContent: "space-evenly",
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
    marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  dayNameContainer: {
    flex: 0,
    marginBottom: 5,
  },
  dayContent: {
    borderRadius: "25px",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "#b7bdb7",
    height: "66%",
  },
  dayName: {
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },

  picture: {
    borderRadius: 5,
    width: 70,
    height: 70,
    resizeMode: "center",
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 5,
    resizeMode: "cover",
  },
  modalePicture: {
    borderRadius: 5,
    width: 110,
    height: 110,
    resizeMode: "center",
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 5,
    resizeMode: "cover",
  },

  caloriesText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "#12db12",
  },
  mealContainer: {
    marginHorizontal: 5,
    marginTop: 10,
    width: "25%",
    justifyContent: "space-between",
  },
  imageFoodContainer: {
    // marginLeft: 5
  },
  mealContent: {
    width: "100%",
    flexDirection: "column",
    //flexWrap: "wrap",
  },
  mealStats: { position: "relative", bottom: 0 },
  addButton: {
    position: "absolute",
    bottom: 220,
    width: 45,
    paddingLeft: 14,
    backgroundColor: "#1c211d",
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 10,
  },
  changeQuantityButton: {
    // alignSelf: "center",
    // alignItems: "center",
    width: 30,
    marginBottom: 10,
    backgroundColor: "#1c211d",
    borderRadius: 3,
  },
  commandButton: {
    backgroundColor: "#b7bdb7",
    padding: 5,

    borderRadius: 3,
    width: 70,
  },
  idText: { fontSize: 10 },
  mealText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  foodText: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalFoodText: { fontSize: 14, fontWeight: "bold", paddingVertical: 10 },
  statText: { fontSize: 10, fontWeight: "bold" },
  vignetteText: {
    height: 20,
    position: "absolute",
    bottom: 3,
    margin: 5,
    padding: 2,
    paddingTop: 5,
    left: 20,
    backgroundColor: "#b7bdb7",
    borderRadius: 3,
    fontWeight: "bold",
  },
  changeButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "green",
    alignSelf: "center",
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
});
