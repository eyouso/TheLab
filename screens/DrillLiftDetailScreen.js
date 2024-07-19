// DrillLiftDetailScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Button } from 'react-native';
import { DrillLiftContext } from '../context/DrillLiftContext';

function DrillLiftDetailScreen({ route, navigation }) {
  const { drillLiftId } = route.params;
  const { drillLifts, updateDrillLiftName } = useContext(DrillLiftContext);
  const drillLift = drillLifts.find(d => d.id === drillLiftId);
  const [title, setTitle] = useState(drillLift.value);

  const handleSave = () => {
    updateDrillLiftName(drillLift.id, title);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Save" onPress={handleSave} />
      </View>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
        />
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.content}>{drillLift.description}</Text>
        <Text style={styles.label}>Instructions:</Text>
        <Text style={styles.content}>{drillLift.instructions}</Text>
        <Text style={styles.label}>Notes:</Text>
        <Text style={styles.content}>{drillLift.notes}</Text>
        {/* You can add a video player here if needed */}
      </ScrollView>
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
});
