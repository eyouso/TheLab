import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DrillLiftContext } from "../context/DrillLiftContext";
import { removeDrillLiftFromWorkout } from "../data/dataService"; // Import the remove function

function DrillLiftDetailScreen({ route, navigation }) {
  const { drillLiftId, workoutId } = route.params || {};
  const { drillLiftsByWorkout, updateDrillLift, deleteDrillLift } = useContext(DrillLiftContext);

  const drillLifts = drillLiftsByWorkout?.[workoutId] || [];
  const drillLift = drillLifts.find((d) => d.id === drillLiftId);

  const [title, setTitle] = useState(drillLift ? drillLift.value : "");
  const [sets, setSets] = useState(drillLift ? drillLift.sets : "");
  const [reps, setReps] = useState(drillLift ? drillLift.reps : "");
  const [description, setDescription] = useState(drillLift ? drillLift.description : "");
  const [instructions, setInstructions] = useState(drillLift ? drillLift.instructions : "");
  const [notes, setNotes] = useState(drillLift ? drillLift.notes : "");
  const [modalVisible, setModalVisible] = useState(false);

  const MAX_DRILL_LIFT_LENGTH = 30;

  useEffect(() => {
    if (!drillLift && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [drillLift, navigation]);

  const handleSave = () => {
    if (drillLift) {
      updateDrillLift(workoutId, drillLift.id, {
        value: title,
        sets,
        reps,
        description,
        instructions,
        notes,
      });
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainScreen");
    }
  };

  const handleDelete = () => {
    setModalVisible(false);
    deleteDrillLift(workoutId, drillLiftId);
    removeDrillLiftFromWorkout(workoutId, drillLiftId); // Remove from active workouts
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("MainScreen");
    }
  };

  if (!drillLift) {
    return <View><Text>Loading...</Text></View>; // or return a loading spinner
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Button
          title="Cancel"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("MainScreen");
            }
          }}
        />
        <Button title="Save" onPress={handleSave} />
      </View>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={-100} // Adjust this value as needed
      >
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={true}
          scrollEnabled={false}
          maxLength={MAX_DRILL_LIFT_LENGTH}
        />
        <Text style={styles.label}>Sets:</Text>
        <TextInput
          style={styles.content}
          value={sets}
          onChangeText={setSets}
          placeholder="X"
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={true}
          scrollEnabled={false}
          maxLength={2}
        />
        <Text style={styles.label}>Reps:</Text>
        <TextInput
          style={styles.content}
          value={reps}
          onChangeText={setReps}
          placeholder="X"
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={true}
          scrollEnabled={false}
          maxLength={2}
        />
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.content}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={true}
          scrollEnabled={false}
          maxLength={100}
        />
        <Text style={styles.label}>Instructions:</Text>
        <TextInput
          style={styles.content}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Instructions"
          multiline
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={true}
          scrollEnabled={false}
          maxLength={100}
        />
        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={styles.content}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
          multiline
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={true}
          scrollEnabled={false}
          maxLength={100}
        />
      </KeyboardAwareScrollView>
      <View style={styles.deleteButtonContainer}>
        <Button
          title="Delete"
          color="red"
          onPress={() => setModalVisible(true)}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete this?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default DrillLiftDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  scrollViewContent: {
    //paddingBottom: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  content: {
    fontSize: 16,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  deleteButtonContainer: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  modalButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});
