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
import {
  fetchGoalsByUserId,
  addGoalToServer,
  updateGoalOnServer,
  deleteGoalFromServer,
  loadGoalsFromLocal,
  saveGoalsToLocal
} from "../data/GoalsDataService";
import {
  fetchProfileData,
  loadProfileDataFromLocal,
  saveProfileDataToLocal
} from "../data/ProfileDataService";

function ProfileScreen() {
  const route = useRoute();
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Load profile data from local storage first, then from the backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Load profile data from local storage
        const storedProfileData = await loadProfileDataFromLocal();
        if (storedProfileData) {
          setProfileData(storedProfileData);
        } else {
          // Fetch profile data from the server if not available locally
          const fetchedProfileData = await fetchProfileData(1); // Assuming profile ID is 1
          setProfileData(fetchedProfileData);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    loadProfile();
  }, []);

  // Load goals from local storage first, then from the backend
  useEffect(() => {
    const loadLocalGoals = async () => {
      try {
        const storedGoals = await loadGoalsFromLocal();
        setGoals(storedGoals);
      } catch (error) {
        console.error('Failed to load local goals:', error);
      }
    };

    const fetchAndMergeServerGoals = async () => {
      try {
        const fetchedGoals = await fetchGoalsByUserId();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Failed to fetch and merge server goals:', error);
      }
    };

    loadLocalGoals();
    fetchAndMergeServerGoals();
  }, []);

  const handleAddGoal = async (newGoal) => {
    try {
      const goalToSend = {
        ...newGoal,
        userId: 2, // Ensure that userId is properly set
        creator: "You", // Assuming this is a fixed value, you can adjust as needed
        targetDate: newGoal.targetDate || null, // Ensure targetDate is nullable if not provided
      };
  
      const addedGoal = await addGoalToServer(goalToSend); // Sync with server
      setGoals((prevGoals) => [...prevGoals, addedGoal]); // Update the local state with the new goal
    } catch (error) {
      console.error("Failed to sync new goal to the server:", error);
    }
  };
  

  const handleSaveGoal = async (goal) => {
    try {
      const updatedGoal = await updateGoalOnServer(goal);
      setGoals((prevGoals) => prevGoals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
    } catch (error) {
      console.error("Failed to sync updated goal to the server:", error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const updatedLocalGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedLocalGoals);
      await saveGoalsToLocal(updatedLocalGoals);
      await deleteGoalFromServer(goalId);
    } catch (error) {
      console.error('Failed to delete goal from server:', error);
    }
  };

  const expandGoal = (id) => {
    setGoals((prevGoals) =>
      prevGoals.map((g) => (g.id === id ? { ...g, isExpanded: true } : g))
    );
  };

  const collapseGoal = (id) => {
    setGoals((prevGoals) =>
      prevGoals.map((g) => (g.id === id ? { ...g, isExpanded: false } : g))
    );
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
      setGoals([]);
    } catch (error) {
      console.error('Failed to clear goals:', error);
    }
  };

  if (!profileData) {
    return <Text>Loading...</Text>;
  }

  const { name, class: className, team, position, heightFeet, heightInches } = profileData;

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
                goalId={item.id}
                goal={item.goal}
                goalTitle={item.goalTitle || item.title}
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
          keyExtractor={(item) => item.id.toString()}
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
