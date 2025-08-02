import { View, Text, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../lib/supabase';
import * as Crypto from 'expo-crypto';


type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;


export default function SignUpScreen ({navigation}: Props){

    const [newUsername, setNewusername] = useState('');
    const [newPassword, setNewpassword] = useState('');

    const handleSignup = async () => {
        
        const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            newPassword
        );

        const {error} = await supabase
            .from('users')
            .insert([{username: newUsername, passwords: hashedPassword}])
        
        if (error){
            console.log('ERREUUUUUUUUR: ', error)
        }

        else {
            navigation.navigate('Login');
        }
    };

    return (
        
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <Text>Sign up here!</Text>
        <TextInput

        placeholder='Enter your username here'
        onChangeText={setNewusername}
        maxLength={40}
        />
        <TextInput
        placeholder='Enter your password here'
        onChangeText={setNewpassword}
        maxLength={40}
        />


        <Button
        title='Create an account'
        onPress={handleSignup}
        />

    </View>

    );

}