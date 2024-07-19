import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function DrillLift(props) {
  const {
    value,
    sets,
    reps,
    description,
    instructions,
    videoUrl,
    notes,
    navigation,
  } = props;

  return (
    <TouchableOpacity
      style={[styles.item, props.isActive && styles.activeItem]}
      onPress={() =>
        navigation.navigate('DrillLiftDetail', {
          drillLift: {
            value,
            sets,
            reps,
            description,
            instructions,
            videoUrl,
            notes,
          },
        })
      }
      onLongPress={props.onLongPress}
      delayLongPress={100}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.itemText}>{value}</Text>
        {(sets || reps) && (
          <View style={styles.setsRepsContainer}>
            {sets && (
              <View style={styles.setsRepsItem}>
                <Text style={styles.label}>Sets:</Text>
                <Text style={styles.numberInput}>{sets}</Text>
              </View>
            )}
            {reps && (
              <View style={styles.setsRepsItem}>
                <Text style={styles.label}>Reps:</Text>
                <Text style={styles.numberInput}>{reps}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default DrillLift;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeItem: {
    backgroundColor: '#cce5ff',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    flex: 1,
  },
  setsRepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setsRepsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  numberInput: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
