import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Linking,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';

// UI
import ButtonBlock from "./ButtonBlock";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function CardProfileHorizontal(props) {
    return (
        <View style={styles.cardContainer} >
            <ImageBackground
                source={{ uri: props.avatar }}
                style={{ width: '100%', height: 250 }}
            />
            <View style={{ margin: 5, flexDirection: 'row',  }}>
                <View style={{ width: '65%' }}>
                    <Text style={{ fontSize: 18, color: '#616161' }} numberOfLines={1}>{ props.name }</Text>
                    <Text style={{ fontSize: 15, color: '#858585' }} numberOfLines={1}>{ props.location }</Text>
                    <Text style={{ fontSize: 18, color: '#858585' }} numberOfLines={1}>{ props.price } Bs.</Text>
                </View>
                <View style={{ width: '35%' }}>
                    <Rating
                        type='star'
                        startingValue={props.rating}
                        readonly
                        imageSize={20}
                        style={{ padding: 5, flexDirection: 'row-reverse' }}
                    />
                </View>
            </View>
            <View style={{ margin: 5,  }}>
                <Text style={{ color: '#858585' }}>{props.description}</Text>
            </View>

            <View style={{ margin: 5, marginTop: 20 }}>
                {props.CustomDateTimePicker}
            </View>
            
            <View style={{ alignItems: 'center', position: 'absolute', bottom: 0 }}>
                {
                    props.available == 0 &&
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ color: 'red',  textAlign: 'center' }}>{ props.errorMessage }</Text>
                    </View>
                }
                {
                    props.available == 1 &&
                    <ButtonBlock
                        icon='videocam-outline'
                        title='Nueva consulta ahora'
                        color='green'
                        colorText='white'
                        onPress={ props.onPress }
                        style={{ width: screenWidth, marginBottom: 0, paddingVertical: 5 }}
                    />
                }
                {
                    props.available == 'programmer' &&
                    <ButtonBlock
                        icon='ios-calendar'
                        title='Programa consulta'
                        color='#4CC5FA'
                        colorText='white'
                        onPress={ props.onPress }
                        style={{ width: screenWidth, marginBottom: 0, paddingVertical: 5 }}
                    />
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10
    }
});