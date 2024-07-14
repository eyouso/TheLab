import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard, } from "react-native";
import Colors from "../constants/colors";

function GoalCard({ goal, goalTitle, goalDescription, saveGoal }) {
    const [title, setTitle] = useState(goalTitle);
    const [description, setDescription] = useState(goalDescription);
    const descriptionRef = useRef(null);

    const handleTitleSubmit = () => {
        descriptionRef.current.focus();
    };

    const handleDescriptionSubmit = () => {
        if (saveGoal) {
            saveGoal({ id: String(Math.random()), goal: "savedGoal", goalTitle: title, goalDescription: description });
        }
    };

    const handleBlur = () => {
        if (saveGoal) {
            saveGoal({ id: String(Math.random()), goal: "savedGoal", goalTitle: title, goalDescription: description });
        }
    };

    if (goal === "teamGoal") {
        return (
            <View style={[styles.container, { backgroundColor: Colors.SecondaryBlue }]}>
                <Text style={styles.goalTitle}>{title}</Text>
                <Text style={styles.goalDescription}>{description}</Text>
            </View>
        );
    } else if (goal === "newGoal") {
        return (
            <View style={[styles.container, { backgroundColor: Colors.EnergyGreen }]}>
                <TextInput
                    style={styles.goalTitle}
                    placeholder="Goal Title"
                    value={title}
                    onChangeText={setTitle}
                    returnKeyType="next"
                    onSubmitEditing={handleTitleSubmit}
                    autoFocus
                />
                <TextInput
                    style={styles.goalDescription}
                    placeholder="Goal Description"
                    value={description}
                    onChangeText={setDescription}
                    ref={descriptionRef}
                    returnKeyType="done"
                    onSubmitEditing={handleDescriptionSubmit}
                    onBlur={handleBlur}
                />
            </View>
        );
    } else {
        return (
            <View style={[styles.container, { backgroundColor: Colors.EnergyGreen }]}>
                <Text style={styles.goalTitle}>{title}</Text>
                <Text style={styles.goalDescription}>{description}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: "95%",
        margin: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.25,
    },
    goalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    goalDescription: {
        fontSize: 16,
        marginVertical: 2,
    },
});

export default GoalCard;
