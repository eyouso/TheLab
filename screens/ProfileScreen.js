import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import NavBar from "../components/NavBar";
import IDCard from "../components/IDCard";
import GoalCard from "../components/GoalCard";
import PrimaryButton from "../components/PrimaryButton";
import dummyProfileData from "../data/dummyProfileData.json";
import dummyGoalData from "../data/dummyGoalData.json";

function ProfileScreen() {
  const route = useRoute();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState(null);

  useEffect(() => {
    // Set initial goals from dummy data
    setGoals(dummyGoalData);
  }, []);

  const { name, class: className, team, position, height } = dummyProfileData;

  const addGoal = () => {
    setNewGoal({
      id: String(goals.length + 1),
      goal: "newGoal",
      goalTitle: "",
      goalDescription: "",
      isEditing: true,
      createdAt: new Date().toISOString(),
      creator: "",
    });
  };

  const saveGoal = (goal) => {
    if (goal.id === "newGoal") {
      goal.id = String(goals.length + 1);
      setGoals([...goals, goal]);
    } else {
      setGoals(goals.map((g) => (g.id === goal.id ? goal : g)));
    }
    setNewGoal(null);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const expandGoal = (id) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, isExpanded: true } : g)));
  };

  const collapseGoal = (id) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, isExpanded: false } : g)));
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
          data={newGoal ? [...goals, newGoal] : goals}
          renderItem={({ item }) => (
            <View style={styles.goalCardContainer}>
              <GoalCard
                goal={item.goal}
                goalTitle={item.goalTitle}
                goalDescription={item.goalDescription}
                isEditing={item.isEditing}
                isExpanded={item.isExpanded}
                saveGoal={saveGoal}
                deleteGoal={() => deleteGoal(item.id)}
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
              <Text style={styles.bodyText}>Add Goal</Text>
              <PrimaryButton onPress={addGoal}>+</PrimaryButton>
            </View>
          }
          contentContainerStyle={styles.flatListContent}
        />
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
  bodyText: {
    fontSize: 18,
    margin: 10,
  },
  flatListContent: {
    paddingBottom: 20, // Adjust this value to add space at the bottom
  },
});

export default ProfileScreen;
