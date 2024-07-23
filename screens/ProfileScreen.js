import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Button,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import NavBar from "../components/NavBar";
import IDCard from "../components/IDCard";
import GoalCard from "../components/GoalCard";
import AddGoalModal from "../components/AddGoalModal"; // Import the new modal
import dummyProfileData from "../data/dummyProfileData.json";
import dummyGoalData from "../data/dummyGoalData.json";

function ProfileScreen() {
  const route = useRoute();
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  useEffect(() => {
    // Set initial goals from dummy data
    setGoals(dummyGoalData);
  }, []);

  const { name, class: className, team, position, height } = dummyProfileData;

  const addGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  const saveGoal = (goal) => {
    setGoals((prevGoals) => prevGoals.map((g) => (g.id === goal.id ? goal : g)));
  };

  const deleteGoal = (id) => {
    setGoals((prevGoals) => prevGoals.filter((g) => g.id !== id));
  };

  const expandGoal = (id) => {
    setGoals((prevGoals) => prevGoals.map((g) => (g.id === id ? { ...g, isExpanded: true } : g)));
  };

  const collapseGoal = (id) => {
    setGoals((prevGoals) => prevGoals.map((g) => (g.id === id ? { ...g, isExpanded: false } : g)));
  };

  const handleDeletePress = (goalId) => {
    setGoalToDelete(goalId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    deleteGoal(goalToDelete);
    setDeleteModalVisible(false);
    setGoalToDelete(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <NavBar routeName={route.name} />
        <IDCard
          name={name}
          class={className}
          team={team}
          position={position}
          feet={height.feet}
          inches={height.inches}
        />
        <KeyboardAwareFlatList
          data={goals}
          renderItem={({ item }) => (
            <View style={styles.goalCardContainer}>
              <GoalCard
                goal={item.goal}
                goalTitle={item.goalTitle}
                isEditing={item.isEditing}
                isExpanded={item.isExpanded}
                saveGoal={saveGoal}
                deleteGoal={() => handleDeletePress(item.id)}
                expandGoal={() => expandGoal(item.id)}
                collapseGoal={() => collapseGoal(item.id)}
                createdAt={item.createdAt}
                creator={item.creator}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
          enableOnAndroid={true}
          ListFooterComponent={
            <View style={styles.addGoalView}>
              <Button title="Add Goal" onPress={() => setIsModalVisible(true)}>Add Goal</Button>
            </View>
          }
          contentContainerStyle={styles.flatListContent}
        />
        <AddGoalModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={addGoal}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete this goal?</Text>
            <Button title="Delete" onPress={confirmDelete} />
            <Button title="Cancel" onPress={() => setDeleteModalVisible(false)} />
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    flex: 1,
  },
  goalCardContainer: {
    marginBottom: 10,
  },
  addGoalView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  flatListContent: {
    paddingBottom: 20, // Adjust this value to add space at the bottom
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: '50%', // Adjust this value to lower the modal
    left: '10%',
    right: '10%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
