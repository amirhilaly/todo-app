import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Button } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Todo = {
  line: string;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function HomeScreen({ route, navigation }: HomeScreenProps) {
  const { username } = route.params;

  const [task, setTask] = useState('');
  const [todosList, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('line')
      .eq('username', username);

    if (!error) {
      setTodos(data || []);
    } else {
      console.log(error);
    }
  };

  const deleteTodo = async (todoSupp: string) => {
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('username', username)
      .eq('line', todoSupp);
    
    if (error) {
      console.log("ERREUR ERREUR WAZZA:", error)
    } else {
      fetchTodos();
    }
  };

  const insertTodo = async () => {
    if (!task.trim()) return;

    const { error } = await supabase
      .from('todos')
      .insert([{ line: task, username }]);

    if (!error) {
      setTask('');
      fetchTodos(); 
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Bienvenue, {username}</Text>

      <FlatList
        data={todosList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => ( <View> <Text>- {item.line}</Text> <Button title="❌" onPress={ () => deleteTodo(item.line)}/> </View>)}
        
      />
      

      <TextInput
        placeholder="Nouvelle tâche"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />

      <Button title="Ajouter tâche" onPress={insertTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
});
