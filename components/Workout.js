import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "../constants/colors";
import PrimaryButton from "./PrimaryButton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function Workout() {
  const [workoutTitle, setWorkoutTitle] = useState("New Workout");
  const [drillLiftName, setDrillLiftName] = useState("");
  const [drillLifts, setDrillLifts] = useState([]);
  const [maxHeight, setMaxHeight] = useState(SCREEN_HEIGHT);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      const keyboardHeight = event.endCoordinates.height;
      const offset = Platform.OS === "ios" ? 30 : 0; // Add some extra offset for iOS
      setMaxHeight(SCREEN_HEIGHT - keyboardHeight - offset);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setMaxHeight(SCREEN_HEIGHT);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function addDrillLift() {
    if (drillLiftName.trim()) {
      setDrillLifts((currentDrillLifts) => [
        ...currentDrillLifts,
        { id: Math.random().toString(), value: drillLiftName },
      ]);
      setDrillLiftName("");
    }
  }

  const renderItem = ({ item, drag, isActive }) => {
    if (item.type === "input") {
      return (
        <View style={styles.inputAndButtonContainer}>
          <TextInput
            onChangeText={setDrillLiftName}
            value={drillLiftName}
            autoCorrect={false}
            style={styles.inputContainer}
            placeholder="Add a new drill or lift"
          />
          <PrimaryButton onPress={addDrillLift}>+</PrimaryButton>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={[styles.item, isActive && styles.activeItem]}
          onLongPress={drag}
          delayLongPress={100}
        >
          <Text style={styles.itemText}>{item.value}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={[styles.container, { maxHeight: maxHeight - 100 }]}>
      <TextInput
        style={styles.workoutTitleText}
        onChangeText={setWorkoutTitle}
        value={workoutTitle}
      />

      <View style={styles.listContainerWidth}>
        <GestureHandlerRootView style={styles.listContainer}>
          <DraggableFlatList
            data={[...drillLifts, { id: "input", type: "input" }]}
            onDragEnd={({ data }) =>
              setDrillLifts(data.filter((item) => item.type !== "input"))
            }
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            bounces={false}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </GestureHandlerRootView>
      </View>
    </View>
  );
}

export default Workout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SecondaryBlue,
    alignItems: "center",
    width: "95%",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
  workoutTitleText: {
    color: Colors.DarkGray,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    marginVertical: 10,
  },
  inputAndButtonContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 10,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    padding: 6,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    borderRadius: 8,
  },
  list: {
    width: "100%",
  },
  listContainerWidth: {
    flexDirection: "row",
  },
  item: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeItem: {
    backgroundColor: "#cce5ff",
  },
  itemText: {
    fontSize: 16,
  },
});
