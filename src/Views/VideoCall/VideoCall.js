import React, { useEffect } from 'react';
import { View, BackHandler } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { connect } from 'react-redux';

function VideoCall(props) {

    useEffect(() => {
        setTimeout(async () => {
            const url = props.route.params.callInfo.url;
            const userInfo = {
                displayName: props.authLogin.user.name,
                email: props.authLogin.user.email,
                avatar: props.authLogin.user.email,
            };

            // console.log(url, userInfo)

            if(url){
                JitsiMeet.call(url, userInfo);
            }

            await AsyncStorage.setItem('SessionCallInfo', '{}');
        }, 2000);
    }, [])

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        JitsiMeet.endCall();
        // props.navigation.navigate('TabMenu');
    });

    function onConferenceTerminated(nativeEvent) {
        /* Conference terminated event */
    }

    function onConferenceJoined(nativeEvent) {
        /* Conference joined event */
        // console.log(nativeEvent)
        props.setCallInit(true);
        props.setCallInProgress(true);
        console.log('joined')
    }

    function onConferenceWillJoin(nativeEvent) {
        /* Conference will join event */
        // console.log(nativeEvent)
        props.setCallInit(true);
        props.setCallInProgress(true);
        console.log('willjoin')
    }

    return (
        <View style={{ backgroundColor: 'black', flex: 1, height: '100%', width: '100%', }}>
            <JitsiMeetView
                onConferenceTerminated={e => onConferenceTerminated(e)}
                onConferenceJoined={e => onConferenceJoined(e)}
                onConferenceWillJoin={e => onConferenceWillJoin(e)}
                style={{
                    flex: 1,
                    height: '100%',
                    width: '100%',
                }}
            />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        authLogin: state.authLogin,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCallInit : (callInit) => dispatch({
            type: 'SET_CALL_INIT',
            payload: callInit
        }),
        setCallInProgress : (callInProgress) => dispatch({
            type: 'SET_CALL_IN_PROGRESS',
            payload: callInProgress
        }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoCall);