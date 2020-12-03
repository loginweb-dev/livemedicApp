import React, { Component } from 'react';
import { SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Modal,
    Dimensions
} from 'react-native';

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

// UI
import CardHistorial from "../../UI/CardHistorial";
import ClearFix from "../../UI/ClearFix";
import CardCustomerRounded from "../../UI/CardCustomerRounded";
import BackgroundLoading from "../../UI/BackgroundLoading";
import AppointmentDetail from "../../UI/AppointmentDetail";

// Llamda en proceso
import CallReturn from "../../UI/CallReturn";

// Config
import { env } from '../../config/env';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class Historial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailShow: false,
            appointments: this.props.historial,
            appointmentDetail: {}
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
        fetch(`${env.API}/api/historial/${this.props.authLogin.user.customer.id}`, headers)
        .then(res => res.json())
        .then(res => {
            if(!res.message && !res.error){
                this.setState({
                    appointments: res.appointments
                }, async () => {
                    this.props.setHistorial(res.appointments);
                    await AsyncStorage.setItem('SessionHistorial', JSON.stringify(res.appointments));
                });
            }
        })
        .catch(error => ({'error': error}));
    }

    showDetailHistorial(item){
        this.setState({appointmentDetail: item})
        this.setState({detailShow: true});
    }

    render(){
        if(!this.state.appointments.length){
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
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                    {
                        this.state.appointments.map(item => 
                            <CardHistorial
                                key={ item.id }
                                name={ item.specialist.full_name }
                                avatar={ `${env.API}/storage/${item.specialist.user.avatar}` }
                                date={ item.created_at }
                                onPress={() => this.showDetailHistorial(item)}
                            />
                        )
                    }
                    <Text>{this.props.callInProgress}</Text>
                </ScrollView>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    visible={this.state.detailShow}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({detailShow: false})}
                >
                    <View>
                        <AppointmentDetail data={this.state.appointmentDetail}/>
                    </View>
                </Modal>

                {/* Llamada en proceso */}
                { this.props.callInProgress && this.props.callInit && <CallReturn onPress={() => this.props.navigation.navigate('VideoCall', {callInfo: this.props.callInfo})} />}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    map: {
        height: screenHeight,
        width: screenWidth,
    },
    header: {
        width: screenWidth,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: 0,
        zIndex:1,
        paddingHorizontal: 10
    },
});

const mapStateToProps = (state) => {
    return {
        authLogin: state.authLogin,
        callInfo: state.callInfo,
        callInit: state.callInit,
        callInProgress: state.callInProgress,
        historial: state.historial
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
        setHistorial : (historial) => dispatch({
            type: 'SET_HISTORIAL',
            payload: historial
        }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Historial);