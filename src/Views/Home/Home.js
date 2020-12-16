import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

// UI
import CardBorderLeft from "../../UI/CardBorderLeft";
import BackgroundLoading from "../../UI/BackgroundLoading";
import HeaderInfo from "../../UI/HeaderInfo";

// Llamda en proceso
import CallReturn from "../../UI/CallReturn";

// Config
import { env } from "../../config/env";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialities: []
        }
    }

    async componentDidMount(){
        let headers = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authLogin.token}`
            },
        }
        
        const SessionCallInfo = await AsyncStorage.getItem('SessionCallInfo');
        if(SessionCallInfo != '' && SessionCallInfo != '{}'){
            try {
                let info = JSON.parse(SessionCallInfo);
                this.props.setCallInfo({
                    id: info.id,
                    url: info.url,
                    specialist: {
                        name: info.specialistName,
                        avatar: info.specialistAvatar
                    }
                });
                this.props.setCallInProgress(true);
            } catch (error) {
                console.log(error)
            }
        }else{
            fetch(`${env.API}/api/appointment/active/${this.props.authLogin.user.customer.id}`, headers)
            .then(res => res.json())
            .then(res => {
                // console.log(res)
                if(res.appointment){
                    this.props.setCallInfo({
                        id: res.appointment.id,
                        url: `${res.server}/Consulta-${res.appointment.code}`,
                        specialist: {
                            name: res.appointment.specialist.full_name,
                            avatar: `${env.API}/storage/${res.appointment.specialist.user.avatar}`
                        }
                    });
                    this.props.setCallInit(true);
                    this.props.setCallInProgress(true);
                }
            })
            .catch(error => ({'error': error}));
        }

        
        fetch(`${env.API}/api/index`, headers)
        .then(res => res.json())
        .then(res => {
            if(!res.message && !res.error){
                this.setState({
                    specialities: res.specialities
                });
            }
        })
        .catch(error => ({'error': error}));
    }

    async componentDidUpdate(){
        const SessionCallInfo = await AsyncStorage.getItem('SessionCallInfo');
        if(SessionCallInfo != '' && SessionCallInfo != '{}'){
            try {
                let info = JSON.parse(SessionCallInfo);
                this.props.setCallInfo({
                    id: info.id,
                    url: info.url,
                    specialist: {
                        name: info.specialistName,
                        avatar: info.specialistAvatar
                    }
                });
                this.props.setCallInProgress(true);
                this.props.navigation.navigate('VideoCall', {callInfo: info});
            } catch (error) {
                console.log(error)
            }
        }
    }

    render(){
        if(!this.state.specialities.length){
            return(
                <BackgroundLoading/>
            )
        }

        // Redirect to call incoming
        if(this.props.callInProgress && !this.props.callInit){
            this.props.navigation.navigate('VideoCall', {callInfo: this.props.callInfo})
        }
        return (
            <SafeAreaView style={ styles.container }>
                <HeaderInfo title='Elige la especialidad'>
                    Presiona sobre el nombre de la especialidad con la necesita ser atendido.
                </HeaderInfo>
                <FlatList
                    style={{ paddingVertical: 10 }}
                    data={this.state.specialities}
                    renderItem={({item, index})=>
                    <CardBorderLeft
                        key={item.id}
                        title={item.name}
                        count={item.specialists.length}
                        icon='car-sport-sharp'
                        borderColor={item.color}
                        onPress={() =>
                            this.props.navigation.navigate('ProfileList', { speciality: item })
                        }
                    />
                    }
                    numColumns={2}
                />

                {/* Llamada en proceso */}
                { this.props.callInProgress && this.props.callInit && <CallReturn onPress={() => this.props.navigation.navigate('VideoCall', {callInfo: this.props.callInfo})} />}
            
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const mapStateToProps = (state) => {
    return {
        authLogin: state.authLogin,
        callInfo: state.callInfo,
        callInit: state.callInit,
        callInProgress: state.callInProgress
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCallInfo : (callInfo) => dispatch({
            type: 'SET_CALL_INFO',
            payload: callInfo
        }),
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);