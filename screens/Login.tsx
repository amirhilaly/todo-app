import { View, Text, Button, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../lib/supabase';
import * as Crypto from 'expo-crypto';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');





  const handleSignupRedirect = () => {
    navigation.navigate('SignUp');
  };


  const handleCryp = async (hPass: string) => {
    const {data, error} = await supabase
      .from('users')
      .select('id')
      .eq('username', username)

      if (error){
        console.log("ERREUR DANS HANDLECRYP: ", error)
      }
      if (!data || data.length === 0) {
        console.log('Data is null in handleCryp')
        return; // Return if data is null
      } 
      const userId = data[0].id;
      
      
  

    const gKey = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      hPass + userId
    );

    return gKey;
  };

  const handleLogin = async () => {


      const {data, error} = await supabase
      .from('users')
      .select('passwords')
      .eq('username', username)

      if (!data || data.length === 0){
        console.log('La data est soit Null soit vide.')
        return; // We quit the fonction here
      } else {
        const hashedPassword = data[0].passwords;

        const compHash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          pass
        );

      let cKey = null
        if (compHash === hashedPassword){
          cKey = await handleCryp(hashedPassword);
        } else {
          Alert.alert('Password incorrect.')
          return;
        }

      

      if (error){
        Alert.alert('Erreur')
        console.log('Error: ', error)
        return; // quitte la fonction pour cancel
      }


    if (!cKey){ // Verification de l'existence de cKey
      console.log('cKey not defined/error')
      return;
    }

    
    navigation.navigate('Home', {username, cKey}); // Si tout les autres tests sont bons, on navigue. :cKey as string
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Connexion</Text>
      <TextInput
        placeholder="Please enter your username"
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10, width: 200 }}
        maxLength={35}
      />
      <TextInput
        placeholder="Entrez votre mot de passe"
        contextMenuHidden={true}
        onChangeText={setPass}
        maxLength={35}
        />
      <Button title="Se connecter" onPress={handleLogin} />


      <Text>Don't have an account yet? Sign up:</Text>
      <Button
      title="Sign up"
      onPress={handleSignupRedirect}
      />
    </View>
  );
};
