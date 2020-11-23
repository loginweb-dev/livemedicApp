import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

// Configurations
import { env } from '../config/env.js';

export default function BackgroundLoading(){

    return (
        <View style={ style.container }>
            <ActivityIndicator size="large" color="#579FD0" />
            <Text style={{ marginTop: 20 }}>Cargando...</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
});