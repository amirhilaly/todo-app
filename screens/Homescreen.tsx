import { View, Text, TextInput, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import { Button } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Todo = {
  id: number;
  line: string;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ route }: HomeScreenProps) {
  const { username, cKey } = route.params;

  const [task, setTask] = useState('');
  const [todosList, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Initial fetch
  useEffect(() => {
    console.log('HERE IS THE CKEY: ', cKey);
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('id, line')
      .eq('username', username);

    if (error) {
      console.log('Error fetching todos: ', error);
    } else {
      setTodos(data || []);
    }
  };

  const insertTodo = async () => {
    if (task === '') {
      console.log('Task est vide');
      return;
    }

    const { error } = await supabase
      .from('todos')
      .insert([{ line: task, username }]);

    if (!error) {
      setTask('');
      fetchTodos();
    }
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('username', username);

    if (error) {
      console.log("Delete error:", error);
    } else {
      fetchTodos();
    }
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = async (id: number) => {
    const { error } = await supabase
      .from('todos')
      .update({ line: editText })
      .eq('id', id)
      .eq('username', username);

    if (error) {
      console.log("Update error:", error);
    } else {
      console.log('Successfully updated data');
      setEditingId(null);
      setEditText('');
      fetchTodos();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.catEmoji}>🐱</Text>
        <Text style={styles.stars}>✨</Text>
        <Text style={styles.catEmoji}>🧡</Text>
      </View>
      
      <Text style={styles.title}>Welcome back, {username}</Text>
      <Text style={styles.subtitle}>Your tasks ⭐</Text>

      <View style={styles.todoContainer}>
        <FlatList
          data={todosList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <Text style={styles.catIcon}>🐱</Text>
              {editingId === item.id ? (
                <>
                  <TextInput
                    style={styles.editInput}
                    value={editText}
                    onChangeText={setEditText}
                    placeholderTextColor="#9966CC"
                  />
                  <Button 
                    title="✅" 
                    onPress={() => saveEdit(item.id)}
                    buttonStyle={styles.saveButton}
                    titleStyle={styles.buttonText}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.todoText}>{item.line}</Text>
                  <Button 
                    title="✏️" 
                    onPress={() => startEditing(item.id, item.line)}
                    buttonStyle={styles.editButton}
                    titleStyle={styles.buttonText}
                  />
                </>
              )}
              <Button 
                title="❌" 
                onPress={() => deleteTodo(item.id)}
                buttonStyle={styles.deleteButton}
                titleStyle={styles.buttonText}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Add new task</Text>
        <View style={styles.addTaskRow}>
          <TextInput
            placeholder="What needs to be done?"
            value={task}
            onChangeText={setTask}
            style={styles.input}
            placeholderTextColor="#9966CC"
          />
          <Text style={styles.catInputIcon}>🐱</Text>
        </View>
        <Button 
          title="Add Task" 
          onPress={insertTodo}
          buttonStyle={styles.addButton}
          titleStyle={styles.addButtonText}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>✨ 🐱 🧡 ✨</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  catEmoji: {
    fontSize: 24,
    marginHorizontal: 15,
  },
  stars: {
    fontSize: 20,
    color: '#DDA0DD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#DDA0DD',
    marginBottom: 20,
  },
  todoContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#9966CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(153, 102, 204, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#9966CC',
  },
  catIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#4B0082',
    fontWeight: '500',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#9966CC',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    backgroundColor: 'white',
    color: '#4B0082',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#9966CC',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: '#32CD32',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#8B008B',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#9966CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4B0082',
    marginBottom: 15,
  },
  addTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#9966CC',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(153, 102, 204, 0.05)',
    color: '#4B0082',
    fontSize: 16,
  },
  catInputIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#8B008B',
    borderRadius: 8,
    paddingVertical: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  footer: {
    marginTop: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
  },
});