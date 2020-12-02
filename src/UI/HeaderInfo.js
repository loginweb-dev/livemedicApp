import React from 'react';
import {
    View, Text
} from 'react-native';


export default function HeaderInfo(props) {
    return (
        <View style={{ alignItems: 'center', margin: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#767676', textAlign: 'center' }}>{ props.title }</Text>
            <Text style={{ color: '#999999', textAlign: 'center' }}>{ props.children }</Text>
        </View>
    );
}