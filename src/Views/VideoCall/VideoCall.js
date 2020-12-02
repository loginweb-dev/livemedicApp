import React, { useEffect } from 'react';
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

            if(url){
                JitsiMeet.call(url, userInfo);
            }
            /* Você também pode usar o JitsiMeet.audioCall (url) para chamadas apenas de áudio */
            /* Você pode terminar programaticamente a chamada com JitsiMeet.endCall () */

            await AsyncStorage.setItem('SessionCallComing', '');
        }, 1000);
  }, [])

  useEffect(() => {
    return () => {
        props.setCallInit(true);
        JitsiMeet.endCall();
    };
  });

    function onConferenceTerminated(nativeEvent) {
        /* Conference terminated event */
        // console.log(nativeEvent)
        props.setCallInit(true);
        console.log('terminate')
    }

    function onConferenceJoined(nativeEvent) {
        /* Conference joined event */
        // console.log(nativeEvent)
        props.setCallInit(true);
        console.log('joined')
    }

    function onConferenceWillJoin(nativeEvent) {
        /* Conference will join event */
        // console.log(nativeEvent)
        props.setCallInit(true);
        console.log('willjoin')
    }

    return (
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
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoCall);