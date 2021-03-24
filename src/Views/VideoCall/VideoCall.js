import React, { useEffect, useState } from 'react';
import { View, BackHandler, Text, Dimensions } from "react-native";
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { connect } from 'react-redux';

// Config
import { env } from "../../config/env";

function VideoCall(props) {

    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${props.authLogin.token}`
        },
    }
    var timer = null;

    useEffect(() => {
        setTimeout(() => {
            const url = props.callInfo.url;
            const userInfo = {
                displayName: props.authLogin.user.name,
                email: props.authLogin.user.email,
                avatar: props.authLogin.user.email,
            };

            // console.log(url, userInfo)

            if(url){
                JitsiMeet.call(url, userInfo);
            }
        }, 2000);

        // Update meet tracking every 30 seconds
        timer = setInterval(() => {
            if(props.callInProgress){
                console.log(props.callInfo.id, props.callInProgress)
                fetch(`${env.API}/api/appointments/tracking/${props.callInfo.id}`, headers);
                console.log('track')
            }
        }, 30000);
    }, [])

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        clearTimeout(timer);
        props.setCallInProgress(false);
        JitsiMeet.endCall();
        return;
        // props.navigation.navigate('TabMenu');
    });

    function onConferenceTerminated(nativeEvent) {
        clearTimeout(timer);
        props.setCallInProgress(false);
        /* Conference terminated event */
    }

    function onConferenceJoined(nativeEvent) {
        /* Conference joined event */
        console.log('joined');
        // Change meet's state
        fetch(`${env.API}/api/appointments/status/${props.callInfo.id}/En_curso`, headers)
    }

    function onConferenceWillJoin(nativeEvent) {
        /* Conference will join event */
        console.log('willjoin')
    }

    return (
        <View style={{ position: 'absolute', backgroundColor: 'black', flex: 1, height: '100%', width: '100%'}}>
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
        callInfo: state.callInfo,
        callInProgress: state.callInProgress
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(VideoCall);