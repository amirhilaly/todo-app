import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerStars}>✨</Text>
        <Text style={styles.catWelcome}>🐱 🧡</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Enter your username"
              onChangeText={setUsername}
              style={styles.input}
              maxLength={35}
              placeholderTextColor="#9966CC"
              value={username}
            />
            <Text style={styles.inputIcon}>🐱</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Enter your password"
              contextMenuHidden={true}
              onChangeText={setPass}
              maxLength={35}
              style={styles.input}
              secureTextEntry={true}
              placeholderTextColor="#9966CC"
              value={pass}
            />
            <Text style={styles.inputIcon}>🧡</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Sign In" 
            onPress={handleLogin}
            color="#8B008B"
          />
        </View>

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>Don't have an account yet?</Text>
          <View style={styles.signupButtonContainer}>
            <Button
              title="Create Account"
              onPress={handleSignupRedirect}
              color="#9966CC"
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerCats}>🐱 🧡</Text>
        <Text style={styles.footerStars}>✨</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerStars: {
    fontSize: 20,
    marginBottom: 10,
    color: '#DDA0DD',
  },
  catWelcome: {
    fontSize: 24,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#DDA0DD',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#9966CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B0082',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  inputIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
  buttonContainer: {
    marginVertical: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  signupSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 15,
  },
  signupButtonContainer: {
    width: '80%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerCats: {
    fontSize: 20,
    marginBottom: 8,
  },
  footerStars: {
    fontSize: 16,
    color: '#DDA0DD',
  },
});