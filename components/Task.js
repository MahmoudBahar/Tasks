import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Task = (props) => {
  const { text, completed } = props;

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square} />
        <Text style={[styles.itemText, completed && styles.itemTextCompleted]}>
          {text}
        </Text>
      </View>
      <View style={[styles.circular, completed && styles.circularCompleted]} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
    fontSize: 16,
  },
  // Strike through text when completed
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  circular: {
    width: 18,
    height: 18,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 9,
  },
  // Fill the circle if completed
  circularCompleted: {
    backgroundColor: '#55BCF6',
  },
});

export default Task;
