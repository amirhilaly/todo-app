import { View, Text, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = () => {
    navigation.navigate('Home', { username });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Connexion</Text>
      <TextInput
        placeholder="Entrez votre pseudo"
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10, width: 200 }}
        maxLength={20}
      />
      <TextInput
        placeholder="Entrez votre mot de passe"
        contextMenuHidden={true}
        onChangeText={setPass}
        maxLength={20}
        />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
}
