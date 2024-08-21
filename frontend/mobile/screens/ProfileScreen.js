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
        const storedGoals = await AsyncStorage.getItem('goals');
        let parsedStoredGoals = storedGoals ? JSON.parse(storedGoals) : [];
  
        const userId = 2;
        const fetchedGoals = await fetchGoalsByUserId(userId);
  
        // Normalize the fetched goals to have a consistent structure
        const normalizedFetchedGoals = fetchedGoals.map(goal => ({
          ...goal,
          goalTitle: goal.title || goal.goalTitle, // Ensure goalTitle exists
        }));
  
        // Combine local and fetched goals (avoiding duplicates)
        const combinedGoals = [...parsedStoredGoals, ...normalizedFetchedGoals];
  
        // Remove duplicates based on goal id
        const uniqueGoals = combinedGoals.reduce((acc, goal) => {
          if (!acc.some(g => g.id === goal.id)) {
            acc.push(goal);
          }
          return acc;
        }, []);
  
        setGoals(uniqueGoals);
  
        await AsyncStorage.setItem('goals', JSON.stringify(uniqueGoals));
        console.log('Saved combined goals to AsyncStorage');
      } catch (error) {
        console.error('Failed to load goals:', error);
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
      const userId = 2; // Fetch or set the correct user ID here, if dynamic use a state or prop
  
      const goalToSend = {
        ...newGoal,
        userId, // Include the userId in the goal object
        targetDate: newGoal.targetDate || null, // Ensure targetDate is null if not provided
      };
  
      const addedGoal = await addGoal(goalToSend); // Sync via dataService
      setGoals((prevGoals) => [...prevGoals, addedGoal]); // Update the local state with the new goal
    } catch (error) {
      console.error("Failed to sync new goal to the server:", error);
    }
  };
  
  const handleSaveGoal = async (goal) => {
    try {
      const updatedGoal = {
        ...goal,
        userId: goal.userId || 2, // Hardcoded userId for now
        title: goal.goalTitle, // Map goalTitle to title for the server
      };
      
      // Remove goalTitle as it's not needed by the server
      delete updatedGoal.goalTitle;
  
      const syncedGoal = await updateGoal(updatedGoal); // Sync via dataService
      if (syncedGoal) {
        setGoals((prevGoals) => prevGoals.map((g) => (g.id === syncedGoal.id ? syncedGoal : g)));
      }
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

  const clearGoals = async () => {
    try {
      await AsyncStorage.removeItem('goals');
      console.log('Goals cleared from AsyncStorage');
    } catch (error) {
      console.error('Failed to clear goals:', error);
    }
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
            console.log('Rendering goal item:', item),
            <View style={styles.goalCardContainer}>
              <GoalCard
                goalId={item.id} // Pass the correct goal ID, which is UUID
                goal={item.goal} // Pass the goal type
                goalTitle={item.goalTitle || item.title} // Ensure title is passed correctly
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
              <Button title="Clear Goals" onPress={clearGoals} />
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
