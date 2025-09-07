import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export default function App() {
  const [task, setTask] = useState<Task>({ id: '', text: '', completed: false });
  const [tasks, setTasks] = useState<Task[]>([]);


  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks", error);
      }
    };
    loadTasks();
  }, []);

  
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks", error);
      }
    };
    saveTasks();
  }, [tasks]);


  const addTask = () => {
    if (task.text.trim().length === 0) return;
    setTasks([...tasks, { ...task, id: Date.now().toString() }]);
    setTask({ id: '', text: '', completed: false });
  };

  const deleteTask = (index: number) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newTasks = tasks.filter((_: any, i: number) => i !== index);
            setTasks(newTasks);
          }
        }
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No tasks yet!</Text>
      <Text style={styles.emptyStateSubtext}>Add your first task to get started</Text>
    </View>
  );

  const renderTask = ({ item, index }: { item: Task; index: number }) => (
    <View style={styles.taskContainer}>
      <View style={styles.taskContent}>
        <View style={styles.taskNumber}>
          <Text style={styles.taskNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.taskText}>{item.text}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteTask(index)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#9ca3af"
          value={task.text}
          onChangeText={(text: any) => setTask({ ...task, text })}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity 
          style={[styles.addButton, task.text.trim().length === 0 && styles.addButtonDisabled]}
          onPress={addTask}
          disabled={task.text.trim().length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.listContainer}>
        <FlatList
          data={tasks}
          keyExtractor={(item: { id: any; }, index: { toString: () => any; }) => item.id ? item.id : index.toString()}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={tasks.length === 0 && styles.emptyListContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#c7d2fe",
    fontWeight: "500",
  },
  inputSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#6366f1",
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  taskNumber: {
    backgroundColor: "#6366f1",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskNumberText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  taskText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    flex: 1,
    lineHeight: 22,
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  deleteButtonText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },
});