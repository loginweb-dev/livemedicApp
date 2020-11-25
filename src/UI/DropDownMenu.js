import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function DropDownMenu(props) {
    return (
        <TouchableOpacity onPress={ props.onPress } style={ styles.container }>
            <View style={ [styles.optionsList] }>
                {props.children}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute'
    },
    optionsList: {
        width: 200,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex:1,
        borderWidth: 1,
        backgroundColor: 'white',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 3 },
        borderRadius: 2,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
        borderColor: '#ddd',
        padding: 10,
        margin: 10
    },
});