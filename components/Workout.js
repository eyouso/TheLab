import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Keyboard,
  Dimensions,
  Platform,
  Button,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '../constants/colors';
import DrillLiftInput from './DrillLiftInput';
import DrillLift from './DrillLift';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function Workout({ navigation }) {
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [drillLiftName, setDrillLiftName] = useState('');
  const [drillLifts, setDrillLifts] = useState([]);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [containerHeight, setContainerHeight] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const containerRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  function addDrillLift() {
    if (drillLiftName.trim()) {
      setDrillLifts((currentDrillLifts) => [
        ...currentDrillLifts,
        {
          id: Math.random().toString(),
          value: drillLiftName,
          sets,
          reps,
          description: 'A default description',
          instructions: 'Default instructions on how to perform the drill/lift.',
          videoUrl: 'http://example.com/default-video',
          notes: 'Default notes.',
        },
      ]);
      setDrillLiftName('');
      setSets('');
      setReps('');
      setTimeout(adjustContainerHeight, 0);
    }
  }

  function cancel() {
    Keyboard.dismiss();
    setDrillLiftName('');
    setIsInputVisible(false);
  }

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
    />
  );

  return (
    <View
      style={[
        styles.container,
        containerHeight ? { height: containerHeight } : {},
      ]}
      ref={containerRef}
    >
      <TextInput
        style={styles.workoutTitleText}
        onChangeText={setWorkoutTitle}
        value={workoutTitle}
        placeholder="New Workout"
        maxLength={MAX_WORKOUT_TITLE_LENGTH}
      />

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
  workoutTitleText: {
    color: Colors.DarkGray,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
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
});
