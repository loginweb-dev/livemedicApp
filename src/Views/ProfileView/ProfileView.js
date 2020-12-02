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
    Modal,
    Linking
} from 'react-native';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { Collapse,CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import RadioForm from 'react-native-simple-radio-button';

// UI
import ButtonBlock from "../../UI/ButtonBlock";
import HeaderInfo from "../../UI/HeaderInfo";
import HyperLink from "../../UI/HyperLink";

// Call coming
import CallComing from "../../UI/CallComing";
import CallReturn from "../../UI/CallReturn";
import OverlayLoading from "../../UI/OverlayLoading";

// Config
import { env } from "../../config/env";


var stripe = require('stripe-client')('sk_test_51HmVTICtBx49MJCtYxRv7wzu92XWkOeXX58B9RA8EPA6cNJlKBUfC43gQc7qdh74jyKzKzFC2EplrNc1t7SkQe0J007a7V0IHx');

var information = {
    card: {
        number: '4242424242424242',
        exp_month: '02',
        exp_year: '21',
        cvc: '999',
        name: 'Billy Joe'
    }
}

const LabelRadioButton = (props) => {
    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, textAlign: 'center' }}>{ props.number }</Text>
            <Text style={{ textAlign: 'center' }}>{ props.nameBank }</Text>
            <Text style={{ fontSize: 10, textAlign: 'center' }}>{ props.nameUser }</Text>
        </View>
    );
}
var timer = null;

// UI
import CardProfileHorizontal from "../../UI/CardProfileHorizontal";
import ClearFix from "../../UI/ClearFix";
import AlertGradient from "../../UI/AlertGradient";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialist: this.props.route.params.specialist,
            paymentAccounts: [],
            paymentModal: false,
            successModal: false,
            errorModal: false,
            collapseStatus: [true, false, false],
            radioProps: [],
            accountSeleted: 0,
            PaymentCreditCardValid: false,
            // Params for request
            price_add: 0,
            payment_type: 2,
            payment_account_id: null,
            observations: '',
            loading: false
        }
    }

    async componentDidMount(){
        let res = await fetch(`${env.API}/api/payment_accounts`)
        .then(res => res.json())
        .then(res => res)
        .catch(error => ({'error': error}));

        if(!res.error){
            let radioProps = [];
            let count = 0;
            res.paymentAccounts.map(account => {
                radioProps.push({
                    label: <LabelRadioButton number={ account.number } nameBank={ account.title } nameUser={ account.name } />,
                    value: count
                });
                count++;
            });
            this.setState({radioProps, paymentAccounts: res.paymentAccounts});
        }
    }

    handleCreditCard = form => {
        this.setState({
            PaymentCreditCardValid: form.valid
        });
    };

    async sendPaymentCreditCad() {

        // var card = await stripe.createToken(information);
        // var token = card.id;
        this.setState({
            paymentModal: false,
            loading: true
        });

        // Get current date and hour
        let dateTime = new Date();
        let date = `${dateTime.getFullYear()}-${String(dateTime.getMonth()+1).padStart(2, "0")}-${String(dateTime.getDate()).padStart(2, "0")}`;
        let start = `${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()+1).padStart(2, "0")}`;

        let params = {
            date,
            start,
            speciality_id: this.props.route.params.specialityId,
            price: this.props.route.params.price,
            price_add: this.state.price_add,
            ajax: 1,
            specialist_id: this.props.route.params.specialist.id,
            customer_id: this.props.authLogin.user.customer.id,
            payment_type: this.state.payment_type,
            payment_account_id: this.state.paymentAccounts[this.state.accountSeleted].id,
            observations: 'nnnnnnn'
        }

        let headers = {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authLogin.token}`
            },
        }
        
        let res = await fetch(`${env.API}/api/appointment/store`, headers)
        .then(res => res.json())
        .then(res => res)
        .catch(error => ({'error': error}));

        if(res.success){
            this.setState({
                successModal: true,
                loading: false
            });
            timer = setTimeout( this.closeModalSuccess, 5000);
        }else{
            this.setState({
                errorModal: true,
                loading: false
            });
        }

        
    }

    collapseTabs(index, isCollapsed){

        let payment_types = [2, 1];

        if(isCollapsed){
            var collapseStatus = [];
            for (let i = 0; i < 3; i++) {
                collapseStatus[i] = i == index ? true : false;
            }
            this.setState({
                collapseStatus,
                payment_type: payment_types[index]
            })
        }
        this.setState({
            PaymentCreditCardValid: false
        });
    }

    closeModalSuccess = () => {
        this.setState({ successModal: false }, () => {
            this.props.navigation.navigate('TabMenu')
        })
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <CardProfileHorizontal
                    name={this.state.specialist.full_name}
                    location={this.state.specialist.location}
                    avatar={this.props.route.params.avatar}
                    price={this.props.route.params.price}
                    rating={this.props.route.params.rating}
                    available={this.state.specialist.status}
                    description={this.state.specialist.description}
                    onPress={() => this.setState({paymentModal: true})}
                />
                {/* Modal payment */}
                <Modal
                    animationType="slide"
                    visible={this.state.paymentModal}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({paymentModal: false})}
                >
                    <View style={{ flex: 1, marginTop: 10 }}>
                        <HeaderInfo title='Elige la forma de pago'>
                            Para que puedas comunicarte con nuestro especialista debes realizar el pago de la consulta.
                        </HeaderInfo>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Pago con tajeta */}
                            <Collapse isCollapsed={ this.state.collapseStatus[0] } onToggle={ isCollapsed => this.collapseTabs(0, isCollapsed) } >
                                <CollapseHeader style={{ width: '100%', paddingHorizontal: 5, paddingTop: 5 }}>
                                    <HeaderCollapse
                                        title='Tarjeta de crédito'
                                        image={require('../../assets/images/credit-card.png')}
                                    />
                                </CollapseHeader>
                                <CollapseBody style={{paddingHorizontal: 5}}>
                                    <View style={{ borderWidth: 1, borderColor: '#E6E6E6', padding: 10, paddingBottom: 20 }}>
                                        <CreditCardInput
                                            onChange={this.handleCreditCard}
                                            labels={
                                                {number: "NUMERO DE TARJETA", expiry: "EXP", cvc: "CVC/CCV"}
                                            }
                                            placeholders={
                                                { number: "1234 5678 1234 5678", expiry: "MM/AA", cvc: "CVC" }
                                            }
                                        />
                                        { this.state.PaymentCreditCardValid &&
                                            <ButtonBlock
                                                icon='checkmark-circle-outline'
                                                title='Realizar pago'
                                                color='green'
                                                colorText='white'
                                                style={{ marginTop: 20 }}
                                                onPress={ () => this.sendPaymentCreditCad() }
                                            />
                                        }
                                    </View>
                                </CollapseBody>
                            </Collapse>

                            {/* Tranferencia bancaria */}
                            <Collapse isCollapsed={ this.state.collapseStatus[1] } onToggle={ isCollapsed => this.collapseTabs(1, isCollapsed) } >
                                <CollapseHeader style={{ width: '100%', paddingHorizontal: 5, paddingTop: 5 }}>
                                    <HeaderCollapse
                                        title='Tranferencia bancaria'
                                        image={require('../../assets/images/transfer.png')}
                                    />
                                </CollapseHeader>
                                <CollapseBody style={{paddingHorizontal: 5}}>
                                    <View style={{ borderWidth: 1, borderColor: '#E6E6E6', padding: 10 }}>
                                        <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                            <RadioForm
                                                radio_props={this.state.radioProps}
                                                initial={ this.state.accountSeleted }
                                                onPress={ value => {this.setState({accountSeleted: value})}}
                                                animation={true}
                                                formHorizontal={true}
                                                labelHorizontal={false}
                                                labelStyle={{ marginTop: 40 }}
                                            />
                                        </View>
                                        <AlertGradient
                                            background={['#07788F', '#58BBCF' ]}
                                            header='Instrucciones'
                                            footer='Cualquier reclamo comunicarse con nuestro centro de atención al cliente.'
                                        >
                                            <Text style={{ color: 'white', textAlign: 'center' }}>
                                                Debes realizar una tranferencia bancaria al número de cuenta seleccionado y posteriormente enviar una captura del comprobante de tranferencia a cualquiera de los siguientes números de Whatsapp:
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                                                <HyperLink url='whatsapp://send?phone=59172841731'>
                                                    +591 72841731
                                                </HyperLink>
                                                <HyperLink url='whatsapp://send?phone=59176866169'>
                                                    +591 76866169
                                                </HyperLink>
                                            </View>
                                        </AlertGradient>
                                        <ButtonBlock
                                            icon='checkmark-circle-outline'
                                            title='Aceptar y continuar'
                                            color='green'
                                            colorText='white'
                                            style={{ marginVertical: 20 }}
                                            onPress={ () => this.sendPaymentCreditCad() }
                                        />
                                    </View>
                                </CollapseBody>
                            </Collapse>
                        </ScrollView>
                    </View>
                </Modal>



                {/* Modal success */}
                <Modal
                    animationType="slide"
                    visible={this.state.successModal}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({successModal: false})}
                >
                    <View style={ styles.successContent }>
                        <Icon name='checkmark-circle-outline' size={100} color='green' />
                        <Text style={{ fontSize: 30, color: '#767676' }}>Bien hecho!</Text>
                        <Text style={{ color: '#767676', textAlign: 'center' }}>En un momento nuestro especialista se comunicará contigo, aguarda un momento por favor!.</Text>
                        <ButtonBlock
                            icon='arrow-back-circle-outline'
                            title='Volver al inicio'
                            color='green'
                            colorText='white'
                            style={{ marginVertical: 20 }}
                            onPress={ this.closeModalSuccess }
                        />
                    </View>
                </Modal>

                {/* Modal error */}
                <Modal
                    animationType="slide"
                    visible={this.state.errorModal}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({errorModal: false})}
                >
                    <View style={ styles.successContent }>
                        <Icon name='close-circle-outline' size={100} color='#DB3C3C' />
                        <Text style={{ fontSize: 30, color: '#767676' }}>Error!</Text>
                        <Text style={{ color: '#767676', textAlign: 'center' }}>Ocurrió un error inesperado, intenta nuevamente!.</Text>
                        <ButtonBlock
                            icon='arrow-back-circle-outline'
                            title='Volver'
                            color='#DB3C3C'
                            colorText='white'
                            style={{ marginVertical: 20 }}
                            onPress={ () => this.setState({ errorModal: false }) }
                        />
                    </View>
                </Modal>

                {/* Llamada entrante */}
                { this.props.callInProgress && !this.props.callInit && <CallComing answerCall={() => this.props.navigation.navigate('VideoCall', {callInfo: this.props.callInfo})} />}
                { this.props.callInProgress && this.props.callInit && <CallReturn onPress={() => this.props.navigation.navigate('VideoCall', {callInfo: this.props.callInfo})} />}

                { this.state.loading && <OverlayLoading/>}
            </SafeAreaView>
        )
    }
}

const HeaderCollapse = (props) => {
    return(
        <View style={{ padding: 10, flexDirection: 'row', borderWidth: 2, borderColor: '#ddd', backgroundColor: '#F0F0F0' }}>
            <View style={{ width: '80%', justifyContent: 'center', }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#5A5A5A' }}>{ props.title }</Text>
            </View>
            <View style={{ width: '20%', flexDirection: 'row-reverse' }}>
                <Image
                    style={{ width: 50, height: 40 }}
                    source={ props.image }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    successContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);