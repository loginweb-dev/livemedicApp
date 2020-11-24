import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function OverlayLoading(){

    return (
        <View style={ style.container }>
            <ActivityIndicator size="large" color="#4598D0" />
            <Text style={{ marginTop: 10, color: 'white' }}>Cargando...</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 5
    }
});