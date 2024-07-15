import React, { useState, useEffect, useRef } from "react";
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

// Get the screen height from the device dimensions
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function Workout() {
  // State variables to manage workout title, drill/lift name, list of drills/lifts, container height, keyboard visibility, and keyboard height
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [drillLiftName, setDrillLiftName] = useState("");
  const [drillLifts, setDrillLifts] = useState([]);
  const [containerHeight, setContainerHeight] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const containerRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Function to adjust the container height based on keyboard visibility and screen height
  const adjustContainerHeight = () => {
    const offset = Platform.OS === "ios" ? 125 : 0; // Offset for iOS
    const maxContainerHeight = SCREEN_HEIGHT - 275; // Maximum container height // Will need to adjust based on device
    const newHeight = SCREEN_HEIGHT - keyboardHeight - offset; // New container height based on keyboard
    const maxHeight = Math.min(newHeight, maxContainerHeight); // Ensure max height is capped

    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height) => {
        console.log("height: ", height);
        console.log("maxContainerHeight: ", maxContainerHeight);
        if (!isKeyboardVisible && height >= maxContainerHeight) {
            console.log("Setting container height to maxContainerHeight");
          setContainerHeight(maxContainerHeight);
        } else if (height >= maxHeight - 25) {
          // Safety margin
          setContainerHeight(maxHeight);
        } else {
          setContainerHeight(null);
        }
      });
    }
  };

  // Effect to handle keyboard show/hide events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        setKeyboardHeight(keyboardHeight);
        const offset = Platform.OS === "ios" ? 125 : 0; // Add some extra offset for iOS
        const newHeight = SCREEN_HEIGHT - keyboardHeight - offset;

        if (containerRef.current) {
          containerRef.current.measure((x, y, width, height) => {
            if (height > newHeight) {
              setContainerHeight(newHeight);
              setIsKeyboardVisible(true);
            }
          });
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setContainerHeight(null);
        setIsKeyboardVisible(false);
        console.log("calling adjustContainerHeight from keyboardDidHideListener");
        setTimeout(adjustContainerHeight, 0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Function to add a new drill or lift to the list
  function addDrillLift() {
    if (drillLiftName.trim()) {
      setDrillLifts((currentDrillLifts) => [
        ...currentDrillLifts,
        { id: Math.random().toString(), value: drillLiftName },
      ]);
      setDrillLiftName("");
      // Check container height right after adding an item
      setTimeout(adjustContainerHeight, 0);
    }
  }

  // Function to render each item in the DraggableFlatList
  const renderItem = ({ item, drag, isActive }) => (
    <TouchableOpacity
      style={[styles.item, isActive && styles.activeItem]}
      onLongPress={drag}
      delayLongPress={100}
    >
      <Text style={styles.itemText}>{item.value}</Text>
    </TouchableOpacity>
  );

  // Render the main component
  return (
    <View
      style={[
        styles.container,
        containerHeight ? { height: containerHeight } : {},
      ]}
      ref={containerRef}
    >
      {/* Input for workout title */}
      <TextInput
        style={styles.workoutTitleText}
        onChangeText={setWorkoutTitle}
        value={workoutTitle}
        placeholder="New Workout"
      />

      {/* Container for the list of drills/lifts */}
      <GestureHandlerRootView
        style={[styles.listContainer, containerHeight ? { flex: 1 } : {}]}
      >
        <DraggableFlatList
          data={drillLifts}
          onDragEnd={({ data }) => setDrillLifts(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          bounces={false}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </GestureHandlerRootView>

      {/* Input and button to add new drills/lifts */}
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
    width: "100%",
    marginTop: 10,
  },
  inputAndButtonContainer: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
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
