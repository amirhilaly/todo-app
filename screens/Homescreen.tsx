import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Button } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Crypto from 'expo-crypto';
import Aes from 'react-native-aes-crypto';



type Todo = {
  line: string;
};


type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function HomeScreen({ route, navigation }: HomeScreenProps) {


  // Cette fonction async d'en dessous permet l'authentification de l'user
    const {username} = route.params;
    const {cKey} = route.params;
    

    useEffect(() => {

      console.log('HERE IS THE CKEY: ', cKey);

      const fetchTodos = async () => {
        const { data, error } = await supabase
          .from('todos')
          .select('line')
          .eq('username', username);

        if (error) {
          console.log('Error fetching todos: ', error);
        } else {
          setTodos(data);
        }
      };

      fetchTodos();

    }, []); // userID as param so this useEffect does NOT run without a userID


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
      .eq('line', todoSupp)
      .eq('username', username);
      
    if (error) {
      console.log("ERREUR ERREUR WAZZA:", error)
    } else {
      fetchTodos();
    }
  };

  const insertTodo = async () => {
    const { error } = await supabase
      .from('todos')
      .insert([{ line: task, username: username}]);

    if (!error) {
      setTask('');
      fetchTodos(); 
    }
  };


  return (
    <View style={styles.container}>
      <Text>Bienvenue, {username}</Text>

      <FlatList
        
        data={todosList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
        ( <View> 
        <Text>- {item.line}</Text>
        <Button title="❌" onPress={ () => deleteTodo(item.line)}
          />
        </View>)}
        
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
