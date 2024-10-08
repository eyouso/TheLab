import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NavBar from '../components/NavBar';
import Workout from '../components/Workout';
import Colors from '../constants/colors';
import { fetchActiveWorkouts, addActiveWorkout, updateActiveWorkout } from '../data/dataService';

const { width } = Dimensions.get('window');

function MainScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const activeWorkouts = fetchActiveWorkouts();
    setWorkouts(activeWorkouts);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.x / width);
    setCurrentPage(pageIndex);
  };

  const addWorkout = () => {
    const newWorkout = {
      id: Math.random().toString(),
      title: '',
      drillLifts: [],
    };
    setWorkouts([...workouts, newWorkout]);
    addActiveWorkout(newWorkout); // Add to dummy database
  };

  const updateDrillLifts = (workoutId, newDrillLifts) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === workoutId
          ? { ...workout, drillLifts: newDrillLifts }
          : workout
      )
    );
    const updatedWorkout = workouts.find(workout => workout.id === workoutId);
    if (updatedWorkout) {
      updatedWorkout.drillLifts = newDrillLifts;
      updateActiveWorkout(updatedWorkout); // Update in dummy database
    }
  };

  const removeWorkoutFromScreen = (workoutId) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout.id !== workoutId));
  };

  return (
    <View style={styles.container}>
      <NavBar />
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.flexContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            {workouts.map((workout) => (
              <View key={workout.id} style={styles.page}>
                <Workout
                  navigation={navigation}
                  workout={workout}
                  updateDrillLifts={updateDrillLifts}
                  removeWorkoutFromScreen={removeWorkoutFromScreen} // Pass the remove function
                />
              </View>
            ))}
            <View style={styles.page}>
              <View style={styles.promptView}>
                <Button title="Add Workout" onPress={addWorkout} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.pagination}>
          {[...Array(workouts.length + 1)].map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentPage === index && styles.activeDot]}
            />
          ))}
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  page: {
    width: width,
    flex: 1,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: '#bbb',
    borderRadius: 5,
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  promptView: {
    margin: 20,
    padding: 20,
  },
});
