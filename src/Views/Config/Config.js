import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions
}
from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { showMessage } from "react-native-flash-message";
import { connect } from 'react-redux';

// UI
import CardSimple from "../../UI/CardSimple";
import TextInputAlt from "../../UI/TextInputAlt";
import ButtonBlock from "../../UI/ButtonBlock";
import ClearFix from "../../UI/ClearFix";

// Llamda en proceso
import CallReturn from "../../UI/CallReturn";

// Configurations
import { env } from '../../config/env.js';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class Config extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.authLogin.user.customer.name,
            last_name: this.props.authLogin.user.customer.last_name,
            phones: this.props.authLogin.user.customer.phones,
            address: this.props.authLogin.user.customer.address,
            email: this.props.authLogin.user.email,
            avatar: this.props.authLogin.user.avatar,
            formShow: false,
            historial: this.props.historial,
            countPrescription: 0,
            countAnalysis: 0
        }
    }

    componentDidMount(){
        let countPrescription = 0;
        let countAnalysis = 0;
        this.state.historial.map(historial => {
            countPrescription += historial.prescription.length;
            countAnalysis += historial.analysis.length;
        });
        this.setState({
            countPrescription, countAnalysis
        });
    }

    submitForm = () => {
        let params = {

        }

        showMessage({
            message: "Perfil actualizado",
            description: "Sus Datos han sido actualizados.",
            type: "info",
            icon: 'info'
        });
        this.setState({formShow: false})
    }

    render(){

        // Redirect to call incoming
        if(this.props.callInProgress && !this.props.callInit){
            this.props.navigation.navigate('VideoCall', {callInfo: this.props.callInfo})
        }

        return (
            <SafeAreaView style={ styles.container }>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                    <CardSimple>
                        <TouchableOpacity onPress={ () => this.setState({formShow: true}) }>
                            <View style={ [styles.cardContainer] }>
                                <View style={{ width: '40%', flex: 1 }}>
                                    <Image
                                        style={{ width: 80, height: 80, borderRadius: 40 }}
                                        source={{ uri: this.state.avatar }}
                                    />
                                </View>
                                <View style={{ width: '60%', paddingLeft: 30 }}>
                                    <Text style={{ fontSize: 18, color: 'black' }} numberOfLines={1}>{ this.state.name }</Text>
                                    <Text style={ styles.textMuted } numberOfLines={1}>{ this.state.email }</Text>
                                    <Text style={ styles.textMuted } numberOfLines={1}>{ this.state.phones }</Text>
                                </View>
                                <View style={{ width: '5%', flex: 1, alignItems: 'center', flexDirection: 'row-reverse' }}>
                                    <Icon name="chevron-forward" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={ [styles.cardContainer, { marginTop: 20, borderTopColor: '#F5F5F5', borderTopWidth: 2, paddingTop: 10 } ] }>
                            <Counter amount={ this.state.historial.length } label='Citas médicas' />
                            <Counter amount={ this.state.countPrescription } label='Recetas' />
                            <Counter amount={ this.state.countAnalysis } label='Laboratorios' />
                        </View>
                    </CardSimple>
                    <ClearFix height={50} />
                </ScrollView>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    // transparent={true}
                    visible={this.state.formShow}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({formShow: false})}
                >
                    <ScrollView style={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontSize: 20, marginHorizontal: 20, marginBottom: 20 }}>Editar Perfil</Text>
                            <Image
                                style={{ width: 80, height: 80, borderRadius: 40, marginVertical: 10 }}
                                source={{ uri: this.state.avatar }}
                            />
                        </View>
                        <View style={ styles.form }>
                            <TextInputAlt
                                label='Nombre'
                                placeholder='Tu nombre'
                                autoCapitalize='words'
                                value={ this.state.name }
                                onChangeText={ value => this.setState({name: value}) }
                            />
                            <TextInputAlt
                                label='Apellidos'
                                placeholder='Tus apellidos'
                                autoCapitalize='words'
                                value={ this.state.last_name }
                                onChangeText={ value => this.setState({last_name: value}) }
                            />
                            <TextInputAlt
                                label='Número de celular'
                                placeholder='Tu número de celular'
                                keyboardType='phone-pad'
                                value={ this.state.phones }
                                onChangeText={ value => this.setState({phones: value}) }
                            />
                            <TextInputAlt
                                label='Email'
                                placeholder='Tu email o celular'
                                keyboardType='email-address'
                                value={ this.state.email }
                                onChangeText={ value => this.setState({email: value}) }
                            />
                            <TextInputAlt
                                label='Contraseña'
                                placeholder='Tu contraseña'
                                password
                            />
                            <View style={{ margin: 20, marginTop: 30 }}>
                                <ButtonBlock
                                icon='save-outline'
                                    title='Guardar cambios'
                                    color='white'
                                    borderColor={ env.color.primary }
                                    colorText={ env.color.primary }
                                    onPress={ this.submitForm }
                                />
                            </View>
                        </View>
                        <ClearFix height={50} />
                    </ScrollView>
                </Modal>

                {/* Llamada en proceso */}
                { this.props.callInProgress && this.props.callInit && <CallReturn onPress={() => this.props.navigation.navigate('VideoCall', {callInfo: this.props.callInfo})} />}
            </SafeAreaView>
        )
    }
}

const Counter = (props) => {
    return(
        <View style={{ width: '33.3%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 25, color: '#5B5C5E' }}>{ props.amount }</Text>
            <Text style={{ fontSize: 15, color: '#5B5C5E' }}>{ props.label }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 10
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    textMuted: {
        fontSize: 13,
        color: '#9A9A9A',
        marginTop: 3
    },
    form:{
        paddingTop: 20,
        backgroundColor: '#fff',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    }
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
    }
}

export default connect(mapStateToProps)(Config);