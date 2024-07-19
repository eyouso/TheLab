// DrillLift.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function DrillLift(props) {
  return (
    <TouchableOpacity
      style={[styles.item, props.isActive && styles.activeItem]}
      onPress={() =>
        props.navigation.navigate('DrillLiftDetail', {
          drillLiftId: props.id,
        })
      }
      onLongPress={props.onLongPress}
      delayLongPress={100}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.itemText}>{props.value}</Text>
        {(props.sets || props.reps) && (
          <View style={styles.setsRepsContainer}>
            {props.sets && (
              <View style={styles.setsRepsItem}>
                <Text style={styles.label}>Sets:</Text>
                <Text style={styles.numberInput}>{props.sets}</Text>
              </View>
            )}
            {props.reps && (
              <View style={styles.setsRepsItem}>
                <Text style={styles.label}>Reps:</Text>
                <Text style={styles.numberInput}>{props.reps}</Text>
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
