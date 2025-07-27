import React, {useState} from 'react'
import { Alert, StyleSheet, View, AppState} from 'react-native'
import {supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

AppState.addEventListener('change', (state) => {
    if (state ==='active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})


export default function Auth() {
    const [password, setPassword] = useState('') // Constante pour les pass
    const [username, setUsername] = useState('') // Constante pour les usernames

    async function signIn() {
        const {error} = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        })

        if (error) Alert.alert(error.message)
    }

    async function signUp(){
        const{
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: username,
            password: password,
        })
        
        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please naw')
    }

}