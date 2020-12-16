import React, { useEffect, useState } from 'react';
import { View, BackHandler, Text, Dimensions } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { connect } from 'react-redux';

import { Rating, AirbnbRating } from 'react-native-ratings';

// UI
import PartialModal from "../../UI/PartialModal";
import ButtonBlock from "../../UI/ButtonBlock";

// Config
import { env } from "../../config/env";

function VideoCall(props) {
    var [ratingModal, setRatingModal] = useState(false);
    var [ratingValue, setRatingValue] = useState(4);
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${props.authLogin.token}`
        },
    }
    var timer = null;

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

        // Update meet tracking every 30 seconds
        timer = setInterval(() => {
            fetch(`${env.API}/api/appointments/tracking/${props.route.params.callInfo.id}`, headers);
            console.log('track')
        }, 30000);
    }, [])

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        clearTimeout(timer);
        JitsiMeet.endCall();
        // props.navigation.navigate('TabMenu');
    });

    function onConferenceTerminated(nativeEvent) {
        clearTimeout(timer);
        setRatingModal(true);
        /* Conference terminated event */
    }

    function onConferenceJoined(nativeEvent) {
        /* Conference joined event */
        // console.log(nativeEvent)
        props.setCallInit(true);
        props.setCallInProgress(true);
        console.log('joined');
        // Change meet's state
        fetch(`${env.API}/api/appointments/status/${props.route.params.callInfo.id}/En_curso`, headers)
    }

    function onConferenceWillJoin(nativeEvent) {
        /* Conference will join event */
        // console.log(nativeEvent)
        props.setCallInit(true);
        props.setCallInProgress(true);
        console.log('willjoin')
    }

    const setRating = async () => {
        
        let body = {
            'id': props.route.params.callInfo.id,
            'user_id': props.authLogin.user.id,
            'rating': ratingValue
        }
        let req = await fetch(`${env.API}/api/meet/rating/store`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${props.authLogin.token}`
            }
        }).then(res => res.json())
        .catch(error => ({'error': error}));
        
        setRatingModal(false);
        clearTimeout(timer);
        props.navigation.navigate('TabMenu');
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

            {/* Rating */}
            {/* Modal description */}
                <PartialModal
                    animationType="slide"
                    visible={ ratingModal }
                    height={ 250 }
                    onRequestClose={ ()=> setRatingModal(false) }
                >
                    <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                        <View style={{ marginTop: 5, alignItems: 'center' }}>
                            <Text style={{ color: env.color.textMuted, fontSize: 20 }}>Ayudanos a mejorar</Text>
                        </View>
                        <Rating
                            showRating={false}
                            // type='star'
                            ratingCount={5}
                            startingValue={ratingValue}
                            imageSize={40}
                            fractions={0}
                            onFinishRating={rating => setRatingValue(rating)}
                            style={{ paddingTop: 30, }}
                        />
                    </View>
                    <View style={{ flex:1, alignItems: 'center', flexDirection: 'column-reverse', width: screenWidth }}>
                        <View style={{ margin: 5 }}>
                            <Text style={{ color: env.color.textMuted, textAlign: 'center' }}>En caso de haber colgado por error, presiona el botón de retroceder 2 veces para ingresar a la llamada.</Text>
                        </View>
                        <ButtonBlock
                            icon='checkmark-circle-outline'
                            title='Puntuar'
                            colorText='white'
                            borderColor={ env.color.primary }
                            color={ env.color.primary }
                            style={{ marginTop: 20, width: screenWidth-50 }}
                            onPress={ setRating }
                        />
                    </View>
                </PartialModal>
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