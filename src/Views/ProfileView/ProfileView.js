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
    Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { Collapse,CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import RadioForm from 'react-native-simple-radio-button';

// UI
import ButtonBlock from "../../UI/ButtonBlock";


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

var radio_props = [
    {
        label: <LabelRadioButton number='1213123123' nameBank='Banco unión' nameUser='Juan Perez P.' />,
        value: 0 },
    {
        label: <LabelRadioButton number='4234543533' nameBank='Banco Ganadero' nameUser='Jorge Mendez P.' />,
        value: 1
    }
];

// UI
import CardProfileHorizontal from "../../UI/CardProfileHorizontal";
import ClearFix from "../../UI/ClearFix";
import AlertGradient from "../../UI/AlertGradient";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialist: this.props.route.params.specialist,
            paymentModal: false,
            successModal: false,
            collapseStatus: [true, false, false],
            accountSeleted: 0,
            PaymentCreditCardValid: false
        }
    }

    handleCreditCard = form => {
        // console.log(form)
        this.setState({
            PaymentCreditCardValid: form.valid
        });
    };

    async sendPaymentCreditCad() {
        // var card = await stripe.createToken(information);
        // var token = card.id;
        this.setState({
            paymentModal: false,
            successModal: true
        });
    }



    collapseTabs(index, isCollapsed){
        if(isCollapsed){
            var collapseStatus = [];
            for (let i = 0; i < 3; i++) {
                collapseStatus[i] = i == index ? true : false;
            }
            this.setState({collapseStatus})
        }
        this.setState({
            PaymentCreditCardValid: false
        });
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <CardProfileHorizontal
                    name={this.state.specialist.name}
                    location={this.state.specialist.location}
                    avatar={this.state.specialist.avatar}
                    price={this.state.specialist.price}
                    rating={this.state.specialist.rating}
                    available={this.state.specialist.available}
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
                        <View style={{ alignItems: 'center', margin: 20 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#767676', textAlign: 'center' }}>Elige la forma de pago</Text>
                            <Text style={{ color: '#999999', textAlign: 'center' }}>Para que puedas comunicarte con nuestro especialista debes realizar el pago de la consulta.</Text>
                        </View>
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
                                                radio_props={radio_props}
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
                                            <Text style={{ color: 'white' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</Text>
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

                {/* Modal payment */}
                <Modal
                    animationType="slide"
                    visible={this.state.successModal}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({successModal: false})}
                >
                    <View style={ styles.successContent }>
                        <Icon name='checkmark-circle-outline' size={100} color='green' />
                        <Text style={{ fontSize: 30, color: '#767676' }}>Bien hecho!</Text>
                        <Text style={{ color: '#767676', textAlign: 'center' }}>En un momento nuestro especualista se comunicará contigo, espera un momento por favor!.</Text>
                        <ButtonBlock
                            icon='arrow-back-circle-outline'
                            title='Volver'
                            color='green'
                            colorText='white'
                            style={{ marginVertical: 20 }}
                            onPress={ () => this.setState({ successModal: false }) }
                        />
                    </View>
                </Modal>
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