import React from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    Dimensions
} from 'react-native';

import { connect } from 'react-redux';

const screenWidth = Math.round(Dimensions.get('window').width);

function CallReturn(props) {
    
    const returnCall = () => {
        props.setCallInProgress(true);
    }

    const closeCall = () => {
        props.setCallInfo({});
        props.setCallInProgress(false);
    }

    return (
        <View style={ styles.container }>
            <View style={ styles.button }>
                <TouchableHighlight
                    onPress={returnCall}
                    style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#377097', borderTopStartRadius: 10, borderBottomStartRadius: 10 }}
                >
                    <Text style={{ color: 'white', fontSize: 20 }}>Volver a la llamada</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={closeCall}
                    style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#286189', borderTopEndRadius: 10, borderBottomEndRadius: 10 }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>x</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        width: screenWidth,
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        margin: 0,
        zIndex:1,
        alignItems: 'center',
    },
    button: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        borderRadius: 10,
        marginHorizontal: 2
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        setCallInfo : (callInfo) => dispatch({
            type: 'SET_CALL_INFO',
            payload: callInfo
        }),
        setCallInProgress : (callInProgress) => dispatch({
            type: 'SET_CALL_IN_PROGRESS',
            payload: callInProgress
        }),
    }
}

export default connect(null, mapDispatchToProps)(CallReturn);