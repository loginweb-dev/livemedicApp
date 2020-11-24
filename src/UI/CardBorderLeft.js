import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Math.round(Dimensions.get('window').width);

const AlertEmpty = () => {
    ToastAndroid.showWithGravityAndOffset(
        'No existen especialistas disponibles',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
    );
}

export default function CardBorderLeft(props) {

    var carColor = ''
    switch (props.borderColor) {
        case 'primary':
            carColor = '#0275d8';
            break;
        case 'success':
            carColor = '#5cb85c';
            break;
        case 'info':
            carColor = '#5bc0de';
            break;
        case 'warning':
            carColor = '#f0ad4e';
            break;
        case 'danger':
            carColor = '#d9534f';
            break;
        case 'light':
            carColor = '#f7f7f7';
            break;
        case 'dark':
            carColor = '#292b2c';
            break;
        default:
            break;
    }

    return (
        <View style={ styles.card }>
            <View style={ [styles.cardContainer, { borderLeftColor: carColor ? carColor : 'black' }] }>
                <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={props.count ? props.onPress : AlertEmpty}
                >
                    <View style={{ width: '85%' }}>
                        <Text style={{ fontSize: 20, color: carColor ? carColor : 'black' }} numberOfLines={1}>{ props.title }</Text>
                        <Text style={{ fontSize: 22, color: '#5B5C5E' }} numberOfLines={1}>{ props.count }</Text>
                    </View>
                    <View style={{ width: '15%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="md-medkit-outline" size={20} color={ carColor ? carColor : 'black'} />
                    </View>
                </TouchableOpacity>
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
        borderRadius: 2,
        borderBottomWidth: 0,
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 3 },
        backgroundColor: 'white',
        borderRadius: 10,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        height: 90,
        width: '95%',
        elevation: 3,
        borderLeftWidth: 5,
        borderTopColor: '#ddd',
        borderRightColor: '#ddd',
        borderBottomColor: '#ddd',
        padding: 5,
        marginBottom: 10
    }
});