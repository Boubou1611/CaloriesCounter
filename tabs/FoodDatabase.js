// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>C'est la FOODBase oue ouee</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

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

export default function TabTwoScreen(navigation) {
  const [items, setItems] = useState();
  const [data, setData] = useState();
  const [selection, setSelection] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [pickerSelectedValue, setPickerSelectedValue] = useState("");
  const [mealPlan, setMealPlan] = useState({
    Breakfast: [],
    Lunch: [],
    Snack: [],
    Dinner: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      //create variable mealPlan to check if mealPlan exist
      const mealPlanStorage = await AsyncStorage.getItem("mealPlan");
      console.log("TabTwoScreen L32 mealPlanStorage:", mealPlanStorage);

      //create mealPlanStorage if not exist
      if (!mealPlanStorage) {
        await AsyncStorage.setItem("mealPlan", JSON.stringify(mealPlan));
      }
      //   const jsonMealPlan = JSON.parse(mealPlan ?? "");
      console.log("TabTwoScreen L37 jsonMealPlan:", mealPlan);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const SearchItem = async (item) => {
    console.log("functions/SearchItem L14 item:", item);

    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://trackapi.nutritionix.com/v2/search/instant?query=${item}`,
        {
          headers: {
            "x-app-id": "dae115c7",
            "x-app-key": "0663d4c3b7c6f582574b174d80f0478e",
          },
        }
      );

      const itemsList = response.data.branded;
      console.log(itemsList);
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
      alert(`functions/SearchItem L28 une erreur est survenue:${error}`);
      console.log(
        `functions/SearchItem L31 une erreur est survenue, error:${error}`
      );
    }
  };

  const ItemFlatList = ({ item, onPress }) => (
    <View style={Styles.itemView}>
      <Image style={Styles.picture} source={{ url: item.picture }} />
      <View style={Styles.pictureCommentView}>
        {/* <Text style={Styles.idText}>id: {item._id}</Text> */}
        <Text style={Styles.itemNameText}>{item.name}</Text>
        <Text style={Styles.commentText}>{item.calories} calories</Text>
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
            selectionId: item._id,
          });
        }}
      />
    );
  };

  const UpdateMealPlan = async (pickerSelectedValue, selection) => {
    switch (pickerSelectedValue) {
      case "Breakfast":
        mealPlan.Breakfast.push(selection["selectionId"]);
        break;
      case "Lunch":
        mealPlan.Lunch.push(selection["selectionId"]);
        break;
      case "Snack":
        mealPlan.Snack.push(selection["selectionId"]);
        break;
      case "Dinner":
        mealPlan.Dinner.push(selection["selectionId"]);
        break;

      default:
        break;
    }
    console.log("TabTwoScreen L134 mealPlan:", mealPlan);
    await AsyncStorage.setItem("mealPlanStorage", JSON.stringify(mealPlan));
    setIsModalDisplay(false);
    setSelection();
  };
  return (
    <View style={Styles.container}>
      <Text style={[Styles.titleText]}>{JSON.stringify(selection)}</Text>

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
            <Picker.Item label="Breakfast" value="Breakfast" />
            <Picker.Item label="Lunch" value="Lunch" />
            <Picker.Item label="Snack" value="Snack" />
            <Picker.Item label="Dinner" value="Dinner" />
          </Picker>
          <TouchableOpacity
            style={Styles.selectButton}
            onPress={() => {
              UpdateMealPlan(pickerSelectedValue, selection);
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
  commentText: { fontSize: 12 },
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
