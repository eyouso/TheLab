import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Keyboard } from "react-native";
import Colors from "../constants/colors";

function GoalCard({ goal, goalTitle, saveGoal, deleteGoal, isEditing: initialIsEditing, isExpanded: initialIsExpanded, expandGoal, collapseGoal, createdAt, creator }) {
    const [title, setTitle] = useState(goalTitle);
    const [isEditing, setIsEditing] = useState(initialIsEditing);
    const [isExpanded, setIsExpanded] = useState(initialIsExpanded);

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
            saveGoal({
                id: goal,
                goal: goal,
                goalTitle: title,
                createdAt,
                creator
            });
        }
    };

    const handleTitleSubmit = () => {
        Keyboard.dismiss();
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        setIsEditing(false);
        collapseGoal();
    };

    const handleDelete = () => {
        deleteGoal();
    };

    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
    });

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={1}>
            <View style={[styles.container, { backgroundColor: goal === "teamGoal" ? Colors.SecondaryBlue : Colors.EnergyGreen }]}>
                {isExpanded && goal === "teamGoal" ? (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.goalType}>Created by {creator}</Text>
                            <Text style={styles.goalDate}>{formattedDate}</Text>
                        </View>
                        <Text style={styles.goalTitle}>{title}</Text>
                        <TouchableOpacity onPress={handleCollapse} style={styles.collapseButton}>
                            <Text style={styles.collapseButtonText}>X</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {isEditing || isExpanded ? (
                            <>
                                {isExpanded && goal !== "teamGoal" && (
                                    <View style={styles.header}>
                                        <Text style={styles.goalType}>Created by you</Text>
                                        <Text style={styles.goalDate}>{formattedDate}</Text>
                                    </View>
                                )}
                                <TextInput
                                    style={styles.goalTitle}
                                    placeholder="Goal Title"
                                    value={title}
                                    onChangeText={setTitle}
                                    returnKeyType="done"
                                    onSubmitEditing={handleTitleSubmit}
                                    autoFocus={initialIsEditing}
                                    maxLength={50}
                                    multiline={true}
                                />
                                {isExpanded && (
                                    <>
                                        {goal !== "teamGoal" && (
                                            <Button title="Delete" onPress={handleDelete} />
                                        )}
                                        <TouchableOpacity onPress={handleCollapse} style={styles.collapseButton}>
                                            <Text style={styles.collapseButtonText}>X</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Text style={styles.goalTitle}>{title}</Text>
                            </>
                        )}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
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
    header: {
        justifyContent: "center",
        width: "100%",
        marginBottom: 10,
        marginLeft: 30,
    },
    goalType: {
        fontSize: 16,
        fontWeight: "bold",
    },
    goalDate: {
        fontSize: 16,
    },
    goalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
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
