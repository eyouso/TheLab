import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from "react-native";
import Colors from "../constants/colors";

function GoalCard({ goal, goalTitle, goalDescription, saveGoal, isEditing: initialIsEditing, isExpanded: initialIsExpanded, expandGoal, collapseGoal }) {
    const [title, setTitle] = useState(goalTitle);
    const [description, setDescription] = useState(goalDescription);
    const [isEditing, setIsEditing] = useState(initialIsEditing);
    const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
    const descriptionRef = useRef(null);

    useEffect(() => {
        if (initialIsEditing) {
            setIsEditing(true);
        }
        if (initialIsExpanded) {
            setIsExpanded(true);
        }
    }, [initialIsEditing, initialIsExpanded]);

    const handlePress = () => {
        setIsExpanded(true);
        setIsEditing(true);
        expandGoal();
    };

    const handleBlur = () => {
        setIsEditing(false);
        setIsExpanded(false);
        if (saveGoal) {
            saveGoal({ id: goal === "newGoal" ? "newGoal" : goal, goal: "savedGoal", goalTitle: title, goalDescription: description });
        }
    };

    const handleTitleSubmit = () => {
        descriptionRef.current.focus();
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        setIsEditing(false);
        collapseGoal();
    };

    if (goal === "teamGoal") {
        return (
            <View style={[styles.container, { backgroundColor: Colors.SecondaryBlue }]}>
                <Text style={styles.goalTitle}>{title}</Text>
                <Text style={styles.goalDescription}>{description}</Text>
            </View>
        );
    } else {
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={1}>
                <View style={[styles.container, { backgroundColor: Colors.EnergyGreen }]}>
                    {isEditing || isExpanded ? (
                        <>
                            <TextInput
                                style={styles.goalTitle}
                                placeholder="Goal Title"
                                value={title}
                                onChangeText={setTitle}
                                returnKeyType="next"
                                onSubmitEditing={handleTitleSubmit}
                                autoFocus={initialIsEditing}
                            />
                            <TextInput
                                style={styles.goalDescription}
                                placeholder="Goal Description"
                                value={description}
                                onChangeText={setDescription}
                                ref={descriptionRef}
                                returnKeyType="done"
                                onBlur={handleBlur}
                            />
                            {isExpanded && (
                                <Button title="Delete" onPress={() => {}} />
                            )}
                            {isExpanded && (
                                <TouchableOpacity onPress={handleCollapse} style={styles.collapseButton}>
                                    <Text style={styles.collapseButtonText}>X</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <>
                            <Text style={styles.goalTitle}>{title}</Text>
                            <Text style={styles.goalDescription}>{description}</Text>
                        </>
                    )}
                </View>
            </TouchableOpacity>
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
    collapseButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    collapseButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default GoalCard;
