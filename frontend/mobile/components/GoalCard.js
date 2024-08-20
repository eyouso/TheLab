import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  Keyboard,
  Modal,
} from "react-native";
import Colors from "../constants/colors";
import { updateGoal } from "../data/dataService"; // Import updateGoal function

function GoalCard({
  goalId, // Changed from goal to goalId to be more explicit
  goal, // Add goal type to differentiate between team and individual goals
  goalTitle,
  saveGoal,
  deleteGoal,
  isEditing: initialIsEditing,
  isExpanded: initialIsExpanded,
  expandGoal,
  collapseGoal,
  createdAt,
  creator,
}) {
  const [title, setTitle] = useState(goalTitle);
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempTitle, setTempTitle] = useState(goalTitle);

  useEffect(() => {
    if (initialIsEditing) {
      setIsEditing(true);
    }
    if (initialIsExpanded) {
      setIsExpanded(true);
    }
  }, [initialIsEditing, initialIsExpanded]);

  useEffect(() => {
    console.log("Received goalTitle:", goalTitle);
    setTitle(goalTitle);
  }, [goalTitle]);

  const handlePress = () => {
    setIsExpanded(true);
    expandGoal();
  };

  const handleTitleSubmit = () => {
    Keyboard.dismiss();
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    collapseGoal();
  };

  const handleDelete = () => {
    deleteGoal();
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    const updatedGoal = {
      id: goalId,
      goalTitle: tempTitle,
      createdAt,
      creator,
    };
    console.log('Updated Goal before saving:', updatedGoal); // Debugging log
    updateGoal(updatedGoal); // Update the goal in the mock database
    setTitle(tempTitle);
    setEditModalVisible(false);
  };

  const handleCancelEdit = () => {
    setTempTitle(title); // Reset the temp title
    setEditModalVisible(false);
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
  

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              goal === "teamGoal" ? Colors.SecondaryBlue : Colors.EnergyGreen,
          },
        ]}
      >
        {isExpanded && goal === "teamGoal" ? (
          <>
            <View style={styles.header}>
              <Text style={styles.goalType}>Created by {creator}</Text>
              <Text style={styles.goalDate}>{formattedDate}</Text>
            </View>
            <Text style={styles.goalTitle}>{title}</Text>
            <TouchableOpacity
              onPress={handleCollapse}
              style={styles.collapseButton}
            >
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
                <Text style={styles.goalTitle}>{title}</Text>
                {isExpanded && (
                  <>
                    {goal !== "teamGoal" && (
                      <View style={styles.buttonRow}>
                        <Button title="Edit" onPress={handleEdit} />
                        <Button title="Delete" onPress={handleDelete} />
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={handleCollapse}
                      style={styles.collapseButton}
                    >
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

        {/* Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit your goal</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Goal Title"
                value={tempTitle}
                onChangeText={setTempTitle}
                returnKeyType="done"
                onSubmitEditing={handleTitleSubmit}
                maxLength={50}
              />
              <View style={styles.modalButtonRow}>
                <Button title="Save" onPress={handleSaveEdit} />
                <Button title="Cancel" onPress={handleCancelEdit} />
              </View>
            </View>
          </View>
        </Modal>
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 20,
    fontSize: 16,
    padding: 5,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default GoalCard;
