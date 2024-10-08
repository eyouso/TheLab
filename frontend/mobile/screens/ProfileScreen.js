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
  updateGoalLocally,
  deleteGoalFromLocal,
  syncDeleteGoalToServer,
  markGoalForDeletion,
  syncPendingDeletions,
  syncGoalsToServer,
  syncGoalToServer,
  clearAllGoalsFromLocal,
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
  const [abortControllers, setAbortControllers] = useState({});

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
        // Load local goals
        const storedGoals = await loadGoalsFromLocal();
        setGoals(storedGoals);
  
        // Sync goals with the server (this already includes syncing with the server)
        const mergedGoals = await syncGoalsToLocalStorage();
        if(mergedGoals){
          setGoals(mergedGoals);
        }
      } catch (error) {
        console.error("Failed to sync goals:", error);
      }
    };
  
    // Run this only once when the component mounts
    loadAndSyncGoals();
  }, []); // Ensure no other dependencies trigger re-renders  

  // Retry syncing pending changes when network is back online
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     if (state.isConnected) {
  //       try {
  //         syncGoalsToLocalStorage(); // Attempt to sync when connected
  //         syncGoalsToServer(); // Attempt to sync with the server
  //       } catch (error) {
  //         console.error("Failed to sync goals:", error);
  //       }
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  const handleAddGoal = async (newGoal) => {
    try {
      // Step 1: Add the goal locally and render it immediately
      const addedGoal = await addGoalToLocal({
        ...newGoal,
        userId: 2,  
        creator: 'You',
        targetDate: newGoal.targetDate || null,
      });
      setGoals((prevGoals) => [...prevGoals, addedGoal]);

      // Step 2: Create an AbortController and store it
      const abortController = new AbortController();
      setAbortControllers((prevControllers) => ({
        ...prevControllers,
        [addedGoal.id]: abortController,  // Track the controller by goal ID
      }));

      // Step 3: Attempt to sync the goal with the server in the background
      await syncGoalToServer(addedGoal, (updatedGoals) => {
        setGoals(updatedGoals); 
        // Clean up after sync
        setAbortControllers((prevControllers) => {
          const { [addedGoal.id]: _, ...rest } = prevControllers; // Remove the controller after syncing
          return rest;
        });
      }, abortController);
    } catch (error) {
      console.error("Failed to add goal:", error);
    }
  };

  const handleSaveGoal = async (updatedGoal) => {
    try {
      // Step 1: Abort any ongoing POST request for the current goal
      const controller = abortControllers[updatedGoal.id];
      if (controller) {
        controller.abort();  // Cancel the current POST request
        setAbortControllers((prevControllers) => {
          const { [updatedGoal.id]: _, ...rest } = prevControllers;  // Remove the aborted controller
          return rest;
        });
      }
  
      // Step 2: Immediately update the UI and local storage
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === updatedGoal.id ? { ...updatedGoal, isPendingSync: true } : goal))
      );
      
      await updateGoalLocally(updatedGoal);  // Save the updated goal to local storage (with isPendingSync)
  
      // Step 3: Attempt to sync the updated goal with the server in the background
      const abortController = new AbortController();
      setAbortControllers((prevControllers) => ({
        ...prevControllers,
        [updatedGoal.id]: abortController,  // Track the controller for this updated goal
      }));
  
      await syncGoalToServer(updatedGoal, (syncedGoals) => {
        // Step 4: Replace the goal in local storage and UI after successful sync
        setGoals(syncedGoals);
        
        // Clean up the AbortController after sync
        setAbortControllers((prevControllers) => {
          const { [updatedGoal.id]: _, ...rest } = prevControllers;  // Remove the abort controller for this goal
          return rest;
        });
      }, abortController);
  
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Update goal request was aborted.');
      } else {
        console.error("Failed to update goal:", error);
      }
    }
  };
  

  const handleDeleteGoal = async (goalId) => {
    try {
      // Step 1: Cancel the ongoing POST request if the goal is in the middle of being added
      const controller = abortControllers[goalId];
      if (controller) {
        controller.abort();  // Cancel the request
        setAbortControllers((prevControllers) => {
          const { [goalId]: _, ...rest } = prevControllers; // Remove the aborted controller
          return rest;
        });
      }
  
      // Step 2: Remove the goal from the local state
      const goalToDelete = goals.find(goal => goal.id === goalId);
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
  
      if (goalToDelete.isPendingSync) {
        // If the goal has never been synced (pending sync), remove it from local storage immediately
        await deleteGoalFromLocal(goalId);
      } else {
        // Step 3: Mark the goal for deletion in local storage if it was already synced
        await markGoalForDeletion(goalId);
  
        // Optionally, try to sync deletion if online
        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected) {
          await syncPendingDeletions(); 
        }
      }
    } catch (error) {
      console.log("Failed to delete goal:", error);
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

  const refreshGoals = async () => {
    console.log("Refreshing goals...");
    try {
      const refreshedGoals = await syncGoalsToLocalStorage(); // Syncs with server
      if (refreshedGoals) {
        setGoals(refreshedGoals); // Update UI with refreshed goals
      }
    } catch (error) {
      console.log("Failed to refresh goals:", error);
    }
    try {
      const updatedGoals = await syncGoalsToServer(); // Syncs with server, including deletions
      if (updatedGoals) {
        setGoals(updatedGoals); // Update UI with synced goals
      }
    } catch (error) {
      console.log("Failed to sync goals to server:", error);
    }
  };

  const clearLocalGoals = async () => {
    try {
      await clearAllGoalsFromLocal(); // Clear all goals from local storage
      setGoals([]); // Update the UI by clearing the state
    } catch (error) {
      console.log("Failed to clear local goals:", error);
    }
  };

  const handlePrintGoalTitles = async () => {
    const allGoals = await loadGoalsFromLocal();  // Load all goals, including ones pending deletion
    allGoals.forEach(goal => {
      console.log(`Goal: ${goal.title} - Pending Delete: ${goal.isPendingDelete || false}`);
    });
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
          data={goals.filter(goal => !goal.isPendingDelete)} // Exclude goals marked for deletion
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
              <Button title="Refresh Goals" onPress={refreshGoals} />
              <Button title="Clear Local Goals" onPress={clearLocalGoals} />
              <Button title="Print Goal Titles" onPress={handlePrintGoalTitles} />
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
    flexDirection: "column",
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
