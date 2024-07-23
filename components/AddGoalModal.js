import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

function AddGoalModal({ visible, onClose, onAdd }) {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');

  const handleAdd = () => {
    if (goalTitle.trim() && goalDescription.trim()) {
      onAdd({
        id: String(Date.now()), // unique id based on timestamp
        goal: 'newGoal',
        goalTitle,
        goalDescription,
        createdAt: new Date().toISOString(),
        creator: 'You',
      });
      setGoalTitle('');
      setGoalDescription('');
      onClose();
    }
  };

  const handleCancel = () => {
    setGoalTitle('');
    setGoalDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="Goal Title"
            value={goalTitle}
            onChangeText={setGoalTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Goal Description"
            value={goalDescription}
            onChangeText={setGoalDescription}
            multiline={true}
            numberOfLines={4}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAdd}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    top: '30%', // Move the modal up
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 80, // Increased height for text area
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddGoalModal;
