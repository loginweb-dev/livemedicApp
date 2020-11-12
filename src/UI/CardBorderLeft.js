import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Math.round(Dimensions.get('window').width);

export default function CardBorderLeft(props) {
    return (
        <View style={ styles.card }>
            <View style={ [styles.cardContainer, { borderLeftColor: props.borderColor ? props.borderColor : 'black' }] }>
                <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={props.onPress}
                >
                    <View style={{ width: '85%' }}>
                        <Text style={{ fontSize: 20, color: props.borderColor ? props.borderColor : 'black' }} numberOfLines={1}>{ props.title }</Text>
                        <Text style={{ fontSize: 22, color: '#5B5C5E' }} numberOfLines={1}>{ props.count }</Text>
                    </View>
                    <View style={{ width: '15%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="md-medkit-outline" size={20} color={props.borderColor ? props.borderColor : 'black'} />
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