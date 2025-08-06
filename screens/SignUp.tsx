import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../lib/supabase';
import * as Crypto from 'expo-crypto';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSignup = async () => {
    if (newPassword === '' || newPassword.length < 6 || newPassword.length > 20) {
      console.log('Password empty or length not between 6 and 20');
      return;
    }

    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      newPassword
    );

    const { error } = await supabase
      .from('users')
      .insert([{ username: newUsername, passwords: hashedPassword }]);

    if (error) {
      console.log('Error:', error);
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerStars}>✨</Text>
        <Text style={styles.catWelcome}>🐱 🧡</Text>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Join our magical community!</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Enter your username"
              onChangeText={setNewUsername}
              maxLength={40}
              style={styles.input}
              placeholderTextColor="#9966CC"
              value={newUsername}
            />
            <Text style={styles.inputIcon}>🐱</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="6 to 20 characters"
              onChangeText={setNewPassword}
              maxLength={20}
              style={styles.input}
              secureTextEntry={true}
              placeholderTextColor="#9966CC"
              value={newPassword}
            />
            <Text style={styles.inputIcon}>🧡</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign Up"
            onPress={handleSignup}
            color="#8B008B"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🐱 🧡 ✨</Text>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
    justifyContent: 'center',
    paddingHorizontal: 50, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headerStars: {
    fontSize: 16,
    color: '#DDA0DD',
    marginBottom: 6,
  },
  catWelcome: {
    fontSize: 20,
    color: 'white',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#DDA0DD',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24, 
    shadowColor: '#9966CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 360,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B0082',
    marginBottom: 6,
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
    paddingVertical: 10, 
    paddingHorizontal: 14,
    backgroundColor: 'rgba(153, 102, 204, 0.05)',
    color: '#4B0082',
    fontSize: 14,
  },
  inputIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 18,
    color: '#DDA0DD',
  },
});
