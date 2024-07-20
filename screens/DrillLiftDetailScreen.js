// DrillLiftDetailScreen.js
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { DrillLiftContext } from '../context/DrillLiftContext';

function DrillLiftDetailScreen({ route, navigation }) {
  const { drillLiftId } = route.params;
  const { drillLifts, updateDrillLift, deleteDrillLift } = useContext(DrillLiftContext);
  const drillLift = drillLifts.find(d => d.id === drillLiftId);
  const [title, setTitle] = useState(drillLift?.value || '');
  const [sets, setSets] = useState(drillLift?.sets || '');
  const [reps, setReps] = useState(drillLift?.reps || '');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!drillLift) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('MainScreen');
      }
    }
  }, [drillLift, navigation]);

  const handleSave = () => {
    if (drillLift) {
      updateDrillLift(drillLift.id, { value: title, sets, reps });
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainScreen');
    }
  };

  const handleDelete = () => {
    setModalVisible(false);
    deleteDrillLift(drillLiftId);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainScreen');
    }
  };

  if (!drillLift) {
    return null; // or return a loading spinner
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Button title="Cancel" onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('MainScreen');
          }
        }} />
        <Button title="Save" onPress={handleSave} />
      </View>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
        />
        <Text style={styles.label}>Sets:</Text>
        <TextInput
          style={styles.content}
          value={sets}
          onChangeText={setSets}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Reps:</Text>
        <TextInput
          style={styles.content}
          value={reps}
          onChangeText={setReps}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.content}>{drillLift.description}</Text>
        <Text style={styles.label}>Instructions:</Text>
        <Text style={styles.content}>{drillLift.instructions}</Text>
        <Text style={styles.label}>Notes:</Text>
        <Text style={styles.content}>{drillLift.notes}</Text>
        {/* You can add a video player here if needed */}
      </ScrollView>
      <View style={styles.deleteButtonContainer}>
        <Button title="Delete" color="red" onPress={() => setModalVisible(true)} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete this?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default DrillLiftDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  content: {
    fontSize: 16,
    marginTop: 10,
  },
  deleteButtonContainer: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
