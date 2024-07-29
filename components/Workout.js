import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Dimensions,
  Platform,
  Button,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '../constants/colors';
import DrillLiftInput from './DrillLiftInput';
import DrillLift from './DrillLift';
import { DrillLiftContext } from '../context/DrillLiftContext';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { deleteActiveWorkout, updateActiveWorkout } from '../data/dataService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function Workout({ workout, updateDrillLifts, removeWorkoutFromScreen }) {
  const { drillLiftsByWorkout, addDrillLiftToWorkout, updateDrillLift } = useContext(DrillLiftContext);
  const [drillLifts, setDrillLifts] = useState(drillLiftsByWorkout[workout.id] || []);
  const [workoutTitle, setWorkoutTitle] = useState(workout.title || '');
  const [drillLiftName, setDrillLiftName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [containerHeight, setContainerHeight] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const containerRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const navigation = useNavigation();

  const MAX_WORKOUT_TITLE_LENGTH = 30;

  const adjustContainerHeight = () => {
    const offset = Platform.OS === 'ios' ? 125 : 0;
    const maxContainerHeight = SCREEN_HEIGHT - 275;
    const newHeight = SCREEN_HEIGHT - keyboardHeight - offset;
    const maxHeight = Math.min(newHeight, maxContainerHeight);

    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height) => {
        if (!isKeyboardVisible && height >= maxContainerHeight) {
          setContainerHeight(maxContainerHeight);
        } else if (height >= maxHeight - 25) {
          setContainerHeight(maxHeight);
        } else {
          setContainerHeight(null);
        }
      });
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        setKeyboardHeight(keyboardHeight);
        const offset = Platform.OS === 'ios' ? 125 : 0;
        const newHeight = SCREEN_HEIGHT - keyboardHeight - offset;

        if (containerRef.current) {
          containerRef.current.measure((x, y, width, height) => {
            if (height > newHeight) {
              setContainerHeight(newHeight);
              setIsKeyboardVisible(true);
            }
          });
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setContainerHeight(null);
      setIsKeyboardVisible(false);
      setTimeout(adjustContainerHeight, 0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    setDrillLifts(drillLiftsByWorkout[workout.id] || []);
  }, [drillLiftsByWorkout, workout.id]);

  const addDrillLift = () => {
    if (drillLiftName.trim()) {
      const newDrillLift = {
        id: Math.random().toString(),
        value: drillLiftName,
        sets,
        reps,
        description: '',
        instructions: '',
        videoUrl: '',
        notes: '',
      };
      setDrillLifts((currentDrillLifts) => [
        ...currentDrillLifts,
        newDrillLift,
      ]);
      addDrillLiftToWorkout(workout.id, newDrillLift);
      setDrillLiftName('');
      setSets('');
      setReps('');
      setTimeout(adjustContainerHeight, 0);
      updateDrillLifts(workout.id, [...drillLifts, newDrillLift]);
    }
  };

  const cancel = () => {
    Keyboard.dismiss();
    setDrillLiftName('');
    setIsInputVisible(false);
  };

  const updateDrillLiftDetails = (id, newDetails) => {
    const updatedDrillLifts = drillLifts.map(drillLift =>
      drillLift.id === id ? { ...drillLift, ...newDetails } : drillLift
    );
    setDrillLifts(updatedDrillLifts);
    updateDrillLift(workout.id, id, newDetails);
    updateDrillLifts(workout.id, updatedDrillLifts);
  };

  const handleTitleChange = (title) => {
    setWorkoutTitle(title);
    const updatedWorkout = { ...workout, title };
    updateActiveWorkout(updatedWorkout);
  };

  const handleDeleteWorkout = () => {
    setMenuVisible(false); // Close the first modal
    setTimeout(() => setDeleteModalVisible(true), 500); // Show the confirmation modal with a slight delay
  };

  const confirmDeleteWorkout = () => {
    deleteActiveWorkout(workout.id);
    removeWorkoutFromScreen(workout.id);
    setDeleteModalVisible(false);
  };

  const renderItem = ({ item, drag, isActive }) => (
    <DrillLift
      value={item.value}
      sets={item.sets}
      reps={item.reps}
      description={item.description}
      instructions={item.instructions}
      videoUrl={item.videoUrl}
      notes={item.notes}
      onLongPress={drag}
      isActive={isActive}
      navigation={navigation}
      id={item.id}
      workoutId={workout.id}
      updateDrillLiftDetails={updateDrillLiftDetails}
    />
  );

  const saveWorkout = () => {
    console.log('Navigating to LibrarySaveOptions with workout:', {
      title: workoutTitle,
      drillLifts,
    });
    navigation.navigate('LibrarySaveOptions', { workout: { title: workoutTitle, drillLifts } });
    setMenuVisible(false);
  };

  return (
    <View
      style={[
        styles.container,
        containerHeight ? { height: containerHeight } : {},
      ]}
      ref={containerRef}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.workoutTitleText}
            onChangeText={handleTitleChange}
            value={workoutTitle}
            placeholder="New Workout"
            maxLength={MAX_WORKOUT_TITLE_LENGTH}
            multiline={true}
            returnKeyType='done'
            blurOnSubmit={true}
          />
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuIcon}>
          <Entypo name="dots-three-horizontal" size={18} color="black" />
        </TouchableOpacity>
      </View>

      <GestureHandlerRootView
        style={[styles.listContainer, containerHeight ? { flex: 1 } : {}]}
      >
        <DraggableFlatList
          data={drillLifts}
          onDragEnd={({ data }) => setDrillLifts(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          bounces={false}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />
      </GestureHandlerRootView>

      {isInputVisible && (
        <View style={styles.inputAndButtonContainer}>
          <DrillLiftInput
            value={drillLiftName}
            onChangeText={setDrillLiftName}
            onSubmitEditing={addDrillLift}
            sets={sets}
            onSetsChange={setSets}
            reps={reps}
            onRepsChange={setReps}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" color={Colors.DarkGray} onPress={cancel} />
            <Button title="Add" color={Colors.DarkGray} onPress={addDrillLift} />
          </View>
        </View>
      )}

      {!isInputVisible && (
        <View style={styles.addButtonContainer}>
          <Button
            title="Add +"
            onPress={() => setIsInputVisible(true)}
            color={Colors.DarkGray}
          />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <Button
              title="Save Workout"
              onPress={saveWorkout}
              disabled={!workoutTitle.trim()}
            />
            <Button
              title="Delete Workout"
              onPress={handleDeleteWorkout} // Handle delete workout
            />
            <Button
              title="Cancel"
              onPress={() => setMenuVisible(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible} // Delete modal visibility
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete this workout? This will not remove it from the library.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmDeleteWorkout} // Confirm delete workout
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Workout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SecondaryBlue,
    alignItems: 'center',
    width: '95%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  workoutTitleText: {
    color: Colors.DarkGray,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    width: '80%',
  },
  menuIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  listContainer: {
    width: '100%',
    marginTop: 10,
  },
  inputAndButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignItems: 'center',
    marginTop: 5,
  },
  list: {
    width: '100%',
  },
  addButtonContainer: {
    marginTop: 0,
    width: '100%',
    alignItems: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
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
