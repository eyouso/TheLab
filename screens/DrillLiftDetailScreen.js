import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Button } from 'react-native';

function DrillLiftDetailScreen({ route, navigation }) {
  const { drillLift } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{drillLift.value}</Text>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
