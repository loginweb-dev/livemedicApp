import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function AlertGradient(props) {
    return (
        <LinearGradient
            colors={ props.background }
            style={ styles.content }
            start={{ x: 0.7, y: 0 }}
        >
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: 'white' }}>{ props.header }</Text>
            </View>
            <View style={{ paddingVertical: 10 }}>
                { props.children }
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 10, color: 'white' }}>{ props.footer }</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 10,
        paddingTop: 15,
        borderWidth: 1,
        borderColor: '#9C9C9C',
        borderRadius: 5,
        elevation: 2
    },
});