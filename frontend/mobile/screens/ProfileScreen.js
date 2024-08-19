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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProfileData, fetchGoalsByUserId, addGoal, updateGoal, deleteGoal } from "../data/dataService";

function ProfileScreen() {
  const route = useRoute();
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const loadGoals = async () => {
      const userId = 2; // Use the correct user ID
      const fetchedGoals = await fetchGoalsByUserId(userId);
      console.log('Fetched goals:', fetchedGoals); // Debugging line to check fetched data
      setGoals(fetchedGoals);
    };
    loadGoals();
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedProfileData = await AsyncStorage.getItem('profileData');
        if (storedProfileData) {
          console.log('Loaded profile data from AsyncStorage:', storedProfileData); // Debugging log
          setProfileData(JSON.parse(storedProfileData));
        } else {
          const data = await fetchProfileData(1); // Use the correct profile ID
          await AsyncStorage.setItem('profileData', JSON.stringify(data));
          console.log('Fetched profile data from API:', data); // Debugging log
          setProfileData(data);
        }
      } catch (error) {
        console.error('Failed to load profile data', error);
      }
    };
    loadProfileData();
  }, []);

  if (!profileData) {
    return <Text>Loading...</Text>;
  }

  const { name, class: className, team, position, heightFeet, heightInches } = profileData;

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
    console.log('Saving goal:', goal); // Debugging log
    const updatedGoal = updateGoal(goal);
    setGoals((prevGoals) => prevGoals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
  };

  const handleDeleteGoal = (id) => {
    console.log('Deleting goal with id:', id); // Debugging log
    const updatedGoals = deleteGoal(id);
    setGoals(updatedGoals);
  };

  const expandGoal = (id) => {
    console.log('Expanding goal with id:', id); // Debugging log
    setGoals((prevGoals) => prevGoals.map((g) => (g.id === id ? { ...g, isExpanded: true } : g)));
  };

  const collapseGoal = (id) => {
    console.log('Collapsing goal with id:', id); // Debugging log
    setGoals((prevGoals) => prevGoals.map((g) => (g.id === id ? { ...g, isExpanded: false } : g)));
  };

  const handleDeletePress = (goalId) => {
    console.log('Delete button pressed for goal id:', goalId); // Debugging log
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
          feet={heightFeet}
          inches={heightInches}
        />
        <KeyboardAwareFlatList
          data={goals}
          renderItem={({ item }) => (
            <View style={styles.goalCardContainer}>
              <GoalCard
                goalId={item.id} // Pass the correct goal ID
                goal={item.goal} // Pass the goal type
                goalTitle={item.title} // Ensure title is passed correctly
                targetDate={item.targetDate}
                isEditing={item.isEditing}
                isExpanded={item.isExpanded}
                saveGoal={handleSaveGoal}
                deleteGoal={() => handleDeletePress(item.id)}
                expandGoal={() => expandGoal(item.id)}
                collapseGoal={() => collapseGoal(item.id)}
                createdAt={item.createdAt}
                creator={item.createdby}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
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
    bottom: '50%',
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
