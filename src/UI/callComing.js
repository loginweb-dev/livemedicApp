import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

function CallComing(props) {

    const endCall = () => {
        Alert.alert(
            "Desviar llamada",
            "Estás seguro que deseas desviar la llamada?",
            [
                {
                text: "Cancelar",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
                },
                { text: "Desviar", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
        );
    }
    
    return (
        <View style={ styles.callContainer }>
            <Image
                style={{ width: 150, height: 150, marginBottom: 10, borderRadius: 75, borderWidth: 5, borderColor: '#579FD0' }}
                source={{ uri: props.callInfo.specialist ? props.callInfo.specialist.avatar : 'https://livemedic.net/storage/users/October2020/EIualVR6wGJtY7baF9lq-cropped.png' }}
            />
            <Text style={{ fontSize: 25, color: 'white' }}>{ props.callInfo.specialist ? props.callInfo.specialist.name : 'Unknown' }</Text>
            <Text style={{ color: 'white' }}>Lamada entrante...</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <ButtonCall
                    color='#d9534f'
                    icon='close'
                    onPress={ endCall }
                />
                <ButtonCall
                    color='#5cb85c'
                    icon='ios-call-outline'
                    onPress={ props.answerCall }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    callContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 10,
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'rgba(0,0,0,0.6)'
    }
});

const ButtonCall = (props) => {
    return(
        <View style={{ width: '50%', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={props.onPress}
                style={{ backgroundColor: props.color, padding: 15, borderRadius: 35 }}>
                <Icon name={props.icon} size={35} color='white' />
            </TouchableOpacity>
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        callInfo: state.callInfo,
    }
}

export default connect(mapStateToProps)(CallComing);