import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
  Modal
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Task from './components/Task';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  // States for editing modal (Android)
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  const handleAddTask = () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    if (!task || task.trim() === '') return;
    const newTask = { key: Date.now().toString(), text: task, completed: false };
    setTaskItems([...taskItems, newTask]);
    setTask('');
  };

  // Toggle the completed status when a task is pressed
  const markTaskAsDone = (rowKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newData = taskItems.map(item =>
      item.key === rowKey ? { ...item, completed: !item.completed } : item
    );
    setTaskItems(newData);
  };

  const deleteTask = (rowKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const newData = taskItems.filter(item => item.key !== rowKey);
    setTaskItems(newData);
  };

  const editTask = (rowKey) => {
    const index = taskItems.findIndex(item => item.key === rowKey);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (Platform.OS === 'ios') {
      // Use native prompt on iOS
      Alert.prompt(
        "Edit Task",
        "Enter new task text:",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Save",
            onPress: (newText) => {
              const newData = [...taskItems];
              newData[index].text = newText;
              setTaskItems(newData);
            }
          }
        ],
        "plain-text",
        taskItems[index].text
      );
    } else {
      // Use custom modal on Android
      setEditingTaskIndex(index);
      setEditingTaskText(taskItems[index].text);
      setModalVisible(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingTaskIndex !== null) {
      const newData = [...taskItems];
      newData[editingTaskIndex].text = editingTaskText;
      setTaskItems(newData);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <SwipeListView
          data={taskItems}
          renderItem={(data) => (
            <View style={{ backgroundColor: "white", borderRadius: 10, overflow: "hidden", maxHeight: 60, marginBottom: 20}}>
              <TouchableOpacity onPress={() => markTaskAsDone(data.item.key)}>
                <Task 
                  text={data.item.text} 
                  completed={data.item.completed} 
                  func={markTaskAsDone} 
                  itemKey={data.item.key} 
                />
              </TouchableOpacity>
            </View>
          )}
          renderHiddenItem={(data) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={[styles.backBtn, styles.backLeftBtn]}
                onPress={() => editTask(data.item.key)}
              >
                <Text style={styles.backTextWhite}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.backBtn, styles.backRightBtn]}
                onPress={() => deleteTask(data.item.key)}
              >
                <Text style={styles.backTextWhite}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={75}   // Swiping right reveals the "Edit" action
          rightOpenValue={-75} // Swiping left reveals the "Delete" action
          disableRightSwipe={false}
        />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput 
          style={styles.input} 
          placeholder={'Write a task'} 
          placeholderTextColor={'#a0a0a0'}
          value={task} 
          onChangeText={setTask} 
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Android Modal for editing task */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        hardwareAccelerated={true}
        statusBarTranslucent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.modalInput}
              value={editingTaskText}
              onChangeText={setEditingTaskText}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20
  },
  backBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backLeftBtn: {
    backgroundColor: '#1f65ff',
    left: 0,
  },
  backRightBtn: {
    backgroundColor: '#ff3d3d',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  modalInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#1f65ff',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
