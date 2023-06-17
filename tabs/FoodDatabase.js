import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import DayName from "../functions/dayName";
import { MealsWeek, Food } from "../class/mealClass";

export default function FoodDatabse({ navigation, route }) {
  const [dayForUpdate, setDayForUpdate] = useState(() => {
    if (route.params) {
      return route.params.dayToUpdate;
    } else {
      return DayName();
    }
  });

  const [items, setItems] = useState();
  const [data, setData] = useState();
  const [selection, setSelection] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [pickerSelectedValue, setPickerSelectedValue] = useState("");
  const [mealWeekPlan, setMealWeekPlan] = useState(new MealsWeek());
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      //create variable mealPlan to check if mealPlan exist
      const mealPlanStorage = await AsyncStorage.getItem(
        "mealsWeekPlanStorage"
      );

      //create mealPlanStorage if not exist
      if (!mealPlanStorage) {
        await AsyncStorage.setItem(
          "mealsWeekPlanStorage",
          JSON.stringify(mealWeekPlan)
        );
      }

      setIsLoading(false);
      setDayForUpdate(() => {
        if (route.params) {
          return route.params.dayToUpdate;
        } else {
          return DayName();
        }
      });
    };
    fetchData();
  }, [isFocused]);

  const SearchItem = async (item) => {
    console.log("functions/SearchItem L14 item:", item);

    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://trackapi.nutritionix.com/v2/search/instant?query=${item}`,
        {
          headers: {
            "x-app-id": "b9973180",
            "x-app-key": "8465f81a70cc42f106e0aa2358d0d446",
          },
        }
      );

      const itemsList = response.data.branded;
      const searchResults = itemsList.map((item) => ({
        _id: item["nix_item_id"],
        name: item["food_name"],
        picture: item.photo["thumb"],
        calories: item["nf_calories"],
      }));
      console.log(searchResults);
      setIsLoading(false);
      setData(searchResults);
      return response;
    } catch (error) {
      alert(`Une erreur est survenue 🧘‍♀️`);
      console.log(
        `functions/SearchItem L94 une erreur est survenue, error:${error}`
      );
    }
  };

  const ItemFlatList = ({ item, onPress }) => (
    <View style={Styles.itemView}>
      <Image style={Styles.picture} source={{ url: item.picture }} />
      <View style={Styles.pictureCommentView}>
        {/* <Text style={Styles.idText}>id: {item._id}</Text> */}
        <Text style={Styles.itemNameText}>{item.name}</Text>
        <Text style={Styles.commentText}>
          {Math.floor(item.calories * 10) / 10} calories
        </Text>
      </View>
      <TouchableOpacity style={[Styles.addButton]} onPress={onPress}>
        <Text style={Styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItemFlatList = ({ item }) => {
    return (
      <ItemFlatList
        item={item}
        onPress={() => {
          setIsModalDisplay(true);
          setSelection({
            ...selection,
            _id: item._id,
            name: item.name,
            calories: item.calories,
          });
        }}
      />
    );
  };

  //Functions
  const UpdateMealPlan = async (
    pickerSelectedValue,
    selection,
    dayForUpdate
  ) => {
    //read the week plan in local storage
    const mealsWeekPlanStorage = await AsyncStorage.getItem(
      "mealsWeekPlanStorage"
    );
    // transform the string to an object
    const weekData = JSON.parse(mealsWeekPlanStorage ?? "");
    console.log(`FoodDatabse L152 mealsWeekPlanStorage:`, mealsWeekPlanStorage);
    //test if food _id exist for the day an the selected meal
    if (
      weekData.days[dayForUpdate][pickerSelectedValue].some(
        (item) => item._id === selection._id
      )
    ) {
      const foundObject = weekData.days[dayForUpdate][pickerSelectedValue].find(
        (item) => item._id === selection._id
      );

      if (foundObject) {
        //if exist add quantity
        foundObject.quantity = parseInt(foundObject.quantity) + 1;
      }
    } else {
      // create food object when doesn't exist
      const food = new Food();
      food._id = selection["_id"];
      food.name = selection["name"];
      food.calories = selection["calories"];
      food.quantity = 1;
      weekData.days[dayForUpdate][pickerSelectedValue].push(food);
    }
    //write modification in local storage
    await AsyncStorage.setItem(
      "mealsWeekPlanStorage",
      JSON.stringify(weekData)
    );
    //undisplay the modal
    setIsModalDisplay(false);
    //reset selection stat
    setSelection();
    //go to Meal Planning screen
    navigation.navigate("Meal");
  };

  return (
    <View style={Styles.container}>
      {/* <Text style={[Styles.titleText]}>{JSON.stringify(selection)}</Text> */}

      <View style={[Styles.searchView]}>
        <TextInput
          label="Search food"
          style={Styles.searchInput}
          value={items}
          selectionColor="green"
          activeUnderlineColor="black"
          onChangeText={setItems}
        />
        <Button
          style={{ flexDirection: "row", padding: 0, height: "100%" }}
          mode="contained"
          buttonColor="green"
          onPress={() => SearchItem(items)}
        >
          Find
        </Button>
      </View>
      {isLoading === true ? (
        <View style={[Styles.container, Styles.horizontal]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItemFlatList}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      )}

      {isModalDisplay ? (
        <View style={[Styles.modal]}>
          <Picker
            selectedValue={pickerSelectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setPickerSelectedValue(itemValue)
            }
            style={{ height: "100%", width: "100%" }}
          >
            <Picker.Item label="Breakfast" value="breakfast" />
            <Picker.Item label="Lunch" value="lunch" />
            <Picker.Item label="Snack" value="snack" />
            <Picker.Item label="Dinner" value="dinner" />
          </Picker>
          <TouchableOpacity
            style={Styles.selectButton}
            onPress={() => {
              UpdateMealPlan(pickerSelectedValue, selection, dayForUpdate);
            }}
          >
            <Text style={Styles.searchButtonText}>Valid choice</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#212121",
  },
  containerActivityIndicator: { flex: 1, justifyContent: "center" },
  searchView: {
    flexDirection: "row",
    width: "100%",
    height: "8%",
    justifyContent: "space-evenly",
  },
  searchInput: { width: "60%", backgroundColor: "#daf2da" },
  searchButton: {
    width: "20%",
    backgroundColor: "green",
    alignContent: "center",
    borderRadius: 10,
  },
  addButton: {
    width: "10%",
    height: "30%",
    backgroundColor: "#1c211d",
    borderRadius: 10,
    marginTop: 40,
    marginRight: 28,
  },
  searchButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  itemNameText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemView: {
    borderRadius: "25px",
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    verticalAlign: "middle",
    backgroundColor: "#daf2da",
    marginVertical: 10,
  },
  picture: {
    borderRadius: 25,
    width: 100,
    height: 100,
    resizeMode: "center",
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  pictureCommentView: {
    verticalAlign: "middle",
    alignContent: "center",
    marginVertical: 15,
    marginHorizontal: 5,
    width: "45%",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  plusText: {
    marginLeft: 11,
    marginTop: 3,
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
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
  pickerStyle: { width: 200, height: 40 },
  pickerItemStyle: { color: "black", backgroundColor: "red" },
  selectButton: {
    width: "90%",
    backgroundColor: "green",
    alignContent: "center",
    borderRadius: 10,
  },
});
