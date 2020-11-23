import React, { useEffect } from 'react';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';

function App(props) {

    const Member = {
        name: props.route.params.callInfo.specialist.name,
        email: props.route.params.callInfo.specialist.email,
        avatar: props.route.params.callInfo.specialist.avatar,
    };

    useEffect(() => {
        setTimeout(() => {
            const url = props.route.params.callInfo.url;
            const userInfo = {
                displayName: Member.name ? Member.name : 'Unknown',
                email: Member.email ? Member.email : 'empresa.loginweb@gmail.com',
                avatar: Member.avatar ? Member.avatar: 'https://livemedic.net/storage/users/October2020/EIualVR6wGJtY7baF9lq-cropped.png',
            };

            if(url){
                JitsiMeet.call(url, userInfo);
            }else{
                JitsiMeet.endCall();
            }
            /* Você também pode usar o JitsiMeet.audioCall (url) para chamadas apenas de áudio */
            /* Você pode terminar programaticamente a chamada com JitsiMeet.endCall () */
        }, 1000);
  }, [])

  useEffect(() => {
    return () => {
        JitsiMeet.endCall();
    };
  });

    function onConferenceTerminated(nativeEvent) {
        /* Conference terminated event */
        console.log(nativeEvent)
    }

    function onConferenceJoined(nativeEvent) {
        /* Conference joined event */
        console.log(nativeEvent)
    }

    function onConferenceWillJoin(nativeEvent) {
        /* Conference will join event */
        console.log(nativeEvent)
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
export default App;
