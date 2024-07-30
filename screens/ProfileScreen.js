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
import AddGoalModal from "../components/AddGoalModal";
import { fetchProfileData, fetchGoalData, addGoal, updateGoal, deleteGoal } from "../data/dataService";

function ProfileScreen() {
  const route = useRoute();
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  useEffect(() => {
    console.log("Fetching initial goals");
    const initialGoals = fetchGoalData();
    console.log("Initial goals:", initialGoals);
    setGoals(initialGoals);
  }, []);

  const profileData = fetchProfileData();
  const { name, class: className, team, position, height } = profileData;

  const handleAddGoal = (newGoal) => {
    console.log("handleAddGoal called");
    const addedGoal = addGoal(newGoal); // Use addGoal from dataService
    console.log("Added goal:", addedGoal);
    setGoals((prevGoals) => {
      const goalExists = prevGoals.some(goal => goal.id === addedGoal.id);
      if (!goalExists) {
        return [...prevGoals, addedGoal];
      }
      return prevGoals;
    });
  };

  const handleSaveGoal = (goal) => {
    const updatedGoal = updateGoal(goal);
    setGoals((prevGoals) => prevGoals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
  };

  const handleDeleteGoal = (id) => {
    const updatedGoals = deleteGoal(id);
    setGoals(updatedGoals);
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
    handleDeleteGoal(goalToDelete);
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
                goalId={item.id} // Pass the correct goal ID
                goal={item.goal} // Pass the goal type
                goalTitle={item.goalTitle}
                goalDescription={item.goalDescription}
                isEditing={item.isEditing}
                isExpanded={item.isExpanded}
                saveGoal={handleSaveGoal}
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
              <Button title="Add Goal" onPress={() => setIsModalVisible(true)} />
            </View>
          }
          contentContainerStyle={styles.flatListContent}
        />
        <AddGoalModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddGoal}
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
