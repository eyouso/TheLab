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
  loadGoalsFromLocal,
  syncGoalsToLocalStorage,
  addGoalToLocal,
  updateGoal,
  deleteGoal,
  syncGoalsToServer,
  syncGoalToServer
} from "../data/GoalsDataService";
import {
  fetchProfileData,
  loadProfileDataFromLocal,
  saveProfileDataToLocal,
} from "../data/ProfileDataService";
import NetInfo from "@react-native-community/netinfo";

function ProfileScreen() {
  const route = useRoute();
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Load profile data from local storage immediately
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfileData = await loadProfileDataFromLocal();
        if (storedProfileData) {
          setProfileData(storedProfileData);
        } else {
          const fetchedProfileData = await fetchProfileData(1);
          setProfileData(fetchedProfileData);
          await saveProfileDataToLocal(fetchedProfileData);
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
        const storedProfileData = await loadProfileDataFromLocal();
        if (storedProfileData) {
          setProfileData(storedProfileData);
        }
      }
    };

    loadProfile();
  }, []);

  // Load and display local goals immediately, then sync with server
  useEffect(() => {
    const loadAndSyncGoals = async () => {
      try {
        // Step 1: Load local goals immediately
        const storedGoals = await loadGoalsFromLocal();
        setGoals(storedGoals);

        // Step 2: Sync goals with the server
        const mergedGoals = await syncGoalsToLocalStorage();
        setGoals(mergedGoals); // Update the UI with the merged goals
      } catch (error) {
        console.error("Failed to sync goals:", error);
      }
    };

    loadAndSyncGoals(); // Load and sync goals on component mount
    try {
      syncGoalsToServer(); // Attempt to sync with the server
    } catch (error) {
      console.error("Failed to sync goals to the server:", error);
    }
  }, []);

  // Retry syncing pending changes when network is back online
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        try {
          syncGoalsToLocalStorage(); // Attempt to sync when connected
          syncGoalsToServer(); // Attempt to sync with the server
        } catch (error) {
          console.error("Failed to sync goals:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddGoal = async (newGoal) => {
    try {
      // Step 1: Add the goal locally and render it immediately
      const addedGoal = await addGoalToLocal({
        ...newGoal,
        userId: 2,
        creator: "You",
        targetDate: newGoal.targetDate || null,
      });
      setGoals((prevGoals) => [...prevGoals, addedGoal]);
  
      // Step 2: Attempt to sync the goal with the server in the background
      await syncGoalToServer(addedGoal, (updatedGoals) => {
        setGoals(updatedGoals); // Update the UI to reflect the sync state immediately
      });
    } catch (error) {
      console.error("Failed to add goal:", error);
    }
  };
  
  

  const handleSaveGoal = async (goal) => {
    try {
      const updatedGoal = await updateGoal({
        ...goal,
        userId: goal.userId || 2,
        title: goal.goalTitle,
      });
      setGoals((prevGoals) =>
        prevGoals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
      );
    } catch (error) {
      console.error("Failed to sync updated goal to the server:", error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const updatedGoals = await deleteGoal(goalId);
      setGoals(updatedGoals); // Update the UI immediately
    } catch (error) {
      console.error("Failed to delete goal locally:", error);
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
      await AsyncStorage.removeItem("goals");
      setGoals([]);
    } catch (error) {
      console.error("Failed to clear goals:", error);
    }
  };

  if (!profileData) {
    return <Text>Loading...</Text>;
  }

  const {
    name,
    class: className,
    team,
    position,
    heightFeet,
    heightInches,
  } = profileData;

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
              {item.isPendingSync && (
                <Text style={styles.pendingSyncText}>Pending Sync</Text>
              )}
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
          enableOnAndroid={true}
          ListFooterComponent={
            <View style={styles.addGoalView}>
              <Button
                title="Add Goal"
                onPress={() => setIsModalVisible(true)}
              />
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
            <Text style={styles.modalText}>
              Are you sure you want to delete this goal?
            </Text>
            <Button title="Delete" onPress={confirmDelete} />
            <Button
              title="Cancel"
              onPress={() => setDeleteModalVisible(false)}
            />
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
    position: "absolute",
    bottom: "50%",
    left: "10%",
    right: "10%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  pendingSyncText: {
    color: "red",
    fontStyle: "italic",
    fontSize: 12,
    textAlign: "right",
    marginTop: 5,
    marginRight: 15,
  },
});

export default ProfileScreen;
