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

// Call coming
import CallComing from "../../UI/CallComing";
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
        const SessionCallComing = await AsyncStorage.getItem('SessionCallComing');
        if(SessionCallComing){
            try {
                let info = JSON.parse(SessionCallComing);
                this.props.setCallInfo({
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

        let headers = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authLogin.token}`
            },
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

    render(){
        if(!this.state.specialities.length){
            return(
                <BackgroundLoading/>
            )
        }
        return (
            <SafeAreaView style={ styles.container }>
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

                {/* Llamada entrante */}
                { this.props.callInProgress && !this.props.callInit && <CallComing answerCall={() => this.props.navigation.navigate('VideoCall', {callInfo: this.props.callInfo})} />}
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