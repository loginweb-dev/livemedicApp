import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';

const screenWidth = Math.round(Dimensions.get('window').width);

export default function CardProfile(props) {
    return (
        <View style={ styles.card }>
            <View style={ styles.cardContainer }>
                <TouchableOpacity
                    onPress={props.onPress}
                >
                    <ImageBackground
                        source={{ uri: props.avatar }}
                        style={{ width: '100%', height: 150 }}
                    />
                    <View style={{ margin: 5 }}>
                        <Text style={{ fontSize: 15, color: '#616161' }} numberOfLines={2}>{ props.name }</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13, color: '#858585', width: '70%' }} numberOfLines={1}>{ props.location }</Text>
                            <View style={{ flexDirection: 'row-reverse', width: '30%' }}>
                                <Text style={{ fontSize: 14, color: '#858585' }} numberOfLines={1}>{ props.price } Bs.</Text>
                                </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={ [styles.badge, { backgroundColor: props.available ? 'green' : 'red' } ] }>{ props.available ? 'Disponible' : 'No disponible' }</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Rating
                    type='star'
                    startingValue={props.rating}
                    readonly
                    imageSize={20}
                    style={{ padding: 5, }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        width: screenWidth/2,
    },
    cardContainer: {
        
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 3 },
        backgroundColor: 'white',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        width: '95%',
        elevation: 3,
        marginBottom: 10
    },
    badge: {
        color: 'white',
        // paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5
    }
});