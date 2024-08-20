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
import { fetchProfileData, fetchGoalsByUserId, addGoal, updateGoal, deleteGoal, addGoalToServer, deleteGoalFromServer } from "../data/dataService";

function ProfileScreen() {
  const route = useRoute();
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Load goals from local storage first, then from the backend
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const storedGoalsJson = await AsyncStorage.getItem('goals');
        let storedGoals = [];
        if (storedGoalsJson) {
          storedGoals = JSON.parse(storedGoalsJson);
          console.log('Loaded goals from AsyncStorage:', storedGoals);
          setGoals(storedGoals);
        }
  
        // Fetch goals from the server
        const userId = 2; // Replace with correct user ID
        const fetchedGoals = await fetchGoalsByUserId(userId);
  
        // Filter out fetched goals that are already in local storage
        const newGoalsFromServer = fetchedGoals.filter(
          fetchedGoal => !storedGoals.some(localGoal => localGoal.id === fetchedGoal.id)
        );
  
        // Combine local goals with new server goals
        const combinedGoals = [...storedGoals, ...newGoalsFromServer];
  
        // Update the state and AsyncStorage with the combined goals
        setGoals(combinedGoals);
        await AsyncStorage.setItem('goals', JSON.stringify(combinedGoals));
        console.log('Saved combined goals to AsyncStorage');
      } catch (error) {
        console.error('Failed to load or sync goals:', error);
      }
    };
    
    loadGoals();
  }, []);
  
  
  

  // Sync goals to AsyncStorage whenever the goals state changes
  useEffect(() => {
    const saveGoalsToStorage = async () => {
      try {
        await AsyncStorage.setItem('goals', JSON.stringify(goals));
        console.log('Saved goals to AsyncStorage');
      } catch (error) {
        console.error('Failed to save goals to AsyncStorage', error);
      }
    };

    if (goals.length > 0) {
      saveGoalsToStorage();
    }
  }, [goals]);

  // Load profile data from AsyncStorage or server
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedProfileData = await AsyncStorage.getItem('profileData');
        if (storedProfileData) {
          setProfileData(JSON.parse(storedProfileData));
        } else {
          const data = await fetchProfileData(1); // Use the correct profile ID
          await AsyncStorage.setItem('profileData', JSON.stringify(data));
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

  // Handle adding a new goal locally and syncing with the server
  const handleAddGoal = async (newGoal) => {
    try {
      const addedGoal = await addGoal(newGoal); // Sync via dataService
      setGoals((prevGoals) => [...prevGoals, addedGoal]);
    } catch (error) {
      console.error("Failed to sync new goal to the server:", error);
    }
  };

  const handleSaveGoal = async (goal) => {
    try {
      const updatedGoal = await updateGoal(goal); // Sync via dataService
      setGoals((prevGoals) => prevGoals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
    } catch (error) {
      console.error("Failed to sync updated goal to the server:", error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      // Delete the goal locally first
      const updatedLocalGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedLocalGoals); // Update the UI immediately
      await AsyncStorage.setItem('goals', JSON.stringify(updatedLocalGoals)); // Save updated goals to AsyncStorage
  
      // Sync the deletion with the server
      await deleteGoalFromServer(goalId, 2); // Assuming userId is 2
      console.log('Goal successfully deleted from server:', goalId);
    } catch (error) {
      console.error('Failed to delete goal from server:', error);
    }
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
          feet={heightFeet}
          inches={heightInches}
        />
        <KeyboardAwareFlatList
          data={goals}
          renderItem={({ item }) => (
            <View style={styles.goalCardContainer}>
              <GoalCard
                goalId={item.id} // Pass the correct goal ID, which is UUID
                goal={item.goal} // Pass the goal type
                goalTitle={item.goalTitle} // Ensure title is passed correctly
                targetDate={item.targetDate}
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
          keyExtractor={(item) => item.id.toString()} // Use UUID as key
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
    paddingBottom: 20,
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
