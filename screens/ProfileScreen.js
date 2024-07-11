import React, { useState } from 'react';
import NavBar from "../components/NavBar";
import { View, Text, StyleSheet, Platform } from "react-native";
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import IDCard from "../components/IDCard";
import GoalCard from "../components/GoalCard";
import PrimaryButton from "../components/PrimaryButton";

function ProfileScreen() {
    const [goals, setGoals] = useState([
        { id: '1', goal: "teamGoal", goalTitle: "Weight Goal", goalDescription: "215lbs" }
    ]);

    const addGoal = () => {
        const newGoal = { id: String(goals.length + 1), goal: "newGoal", goalTitle: "New Goal", goalDescription: "Description" };
        setGoals([...goals, newGoal]);
    }

    return (
        <View style={styles.screen}>
            <View>
                <NavBar />
            </View>
            <IDCard 
                name="Ethan Youso"
                class="2024"
                team="St. John's University"
                position="Point Guard"
                feet="6"
                inches="7"
            />
            <KeyboardAwareFlatList
                data={goals}
                renderItem={({ item }) => (
                    <View style={styles.goalCardContainer}>
                        <GoalCard goal={item.goal} goalTitle={item.goalTitle} goalDescription={item.goalDescription} />
                    </View>
                )}
                keyExtractor={item => item.id}
                extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
                enableOnAndroid={true}
                ListFooterComponent={
                    <View style={styles.addGoalView}>
                        <Text style={styles.bodyText}>Add Goal</Text>
                        <PrimaryButton onPress={addGoal}>+</PrimaryButton>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "white",
        flex: 1,
    },
    container: {
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
});

export default ProfileScreen;
