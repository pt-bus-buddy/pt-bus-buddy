import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SchedulesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bus Schedules will be displayed here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SchedulesScreen;
