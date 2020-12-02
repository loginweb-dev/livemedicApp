import React from 'react';
import {
    View, Text
} from 'react-native';


export default function Card(props) {
    return (
        <View style={{ borderWidth: 1, borderColor: props.color ? props.color : '#ddd', borderRadius: 5, marginVertical: 10 }}>
            <View style={{ paddgin: 10, backgroundColor: props.color ? props.color : '#ddd' }}>
                <Text style={{ padding: 10, color: props.textColor ? props.textColor : '#000' }}>{ props.title }</Text>
            </View>

            <View style={{ padding: 10 }}>
                { props.children }
            </View>
        </View>
    );
}