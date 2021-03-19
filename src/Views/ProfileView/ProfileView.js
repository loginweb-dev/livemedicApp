import React, { Component, useState, useEffect } from 'react';
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
    Button,
    Alert,
    Switch
} from 'react-native';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { Collapse,CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import RadioForm from 'react-native-simple-radio-button';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Picker} from '@react-native-picker/picker';
import SelectMultiple from 'react-native-select-multiple'
import { showMessage } from "react-native-flash-message";


// UI
import ButtonBlock from "../../UI/ButtonBlock";
import HeaderInfo from "../../UI/HeaderInfo";
import HyperLink from "../../UI/HyperLink";
import OverlayLoading from "../../UI/OverlayLoading";
import PartialModal from "../../UI/PartialModal";
import BackgroundLoading from "../../UI/BackgroundLoading";
import CardProfileHorizontal from "../../UI/CardProfileHorizontal";
import ClearFix from "../../UI/ClearFix";
import AlertGradient from "../../UI/AlertGradient";
import TextInputAlt from "../../UI/TextInputAlt";

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

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const DATE = new Date();

class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authLogin.token}`
            },
            initialLat : env.location.latitude,
            initialLon: env.location.longitude,
            region: {
                latitude: env.location.latitude,
                longitude: env.location.longitude,
                latitudeDelta: 0.0422,
                longitudeDelta: screenWidth / (screenHeight - 130) * 0.0422
            },
            specialist: this.props.route.params.specialist,
            speciality_id: this.props.route.params.speciality_id,
            paymentAccounts: [],
            descriptionModal: false,
            paymentModal: false,
            successModal: false,
            errorModal: false,
            collapseStatus: [true, false, false],
            radioProps: [],
            servicesList: [],
            services: [],
            selectedServices: [],
            accountSeleted: 0,
            PaymentCreditCardValid: false,
            modalTimePickerOpen: false,
            // Params for request
            daySelected: DATE.getDay(),
            date: '',
            start: '',
            price: this.props.route.params.price,
            price_add: 0,
            priceAltSwitch: false,
            payment_type: 1,
            payment_account_id: null,
            observations: '',
            loading: false,
            isDatePickerVisible: false,
            appointmentsQueue: [],
            errorMessage: 'El especialista no se encuentra disponible ahora, si desea puede programar una cita para otro momento.'
        }
    }

    async componentDidMount(){
        // Get current date and hour
        let dateTime = new Date();
        let date = `${dateTime.getFullYear()}-${String(dateTime.getMonth()+1).padStart(2, "0")}-${String(dateTime.getDate()).padStart(2, "0")}`;
        let start = `${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()+1).padStart(2, "0")}`;
        this.setState({date, start});

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

        Geolocation.getCurrentPosition(async position => {
            this.setState({
                region: {
                    ...this.state.region,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
            });

            // Si la especialidad es enfermería se ejecuta ésta función
            if(this.state.speciality_id == 3){
                // Change map center
                this.map.animateToRegion({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta
                });

                let res = await fetch(`${env.API}/api/services`)
                .then(res => res.json())
                .then(res => res)
                .catch(error => ({'error': error}));

                let services = [];
                if(res.services){
                    res.services.map(service => {
                        services.push({
                            label: service.name, value: service.id
                        });
                    });
                    this.setState({servicesList: res.services, services});
                }
            }
        });
    }

    handleCurrentLocation(location){
        this.setState({
            region: {
                ...this.state.region,
                latitude: location.latitude,
                longitude: location.longitude,
            }
        })
    }

    handleSwitch = () => {
        if(this.state.priceAltSwitch){
            this.setState({price: this.props.route.params.price, priceAltSwitch: !this.state.priceAltSwitch});
            return;
        }
        fetch(`${env.API}/api/appointments/customer/${this.props.authLogin.user.customer.id}/${this.state.specialist.id}/${this.state.speciality_id}`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
            if(res.speciality){
                this.setState({
                    price: res.speciality.price_alt
                });
                this.setState({priceAltSwitch: !this.state.priceAltSwitch});
            }else{
                showMessage({
                    message: "Error",
                    description: res.error,
                    type: "danger",
                    icon: 'danger'
                });
            }
        })
        .catch(error => ({'error': error}));
    }

    selectMultipleChange = selectedServices => {
        this.setState({selectedServices}, () => {
            let observations = '';
            let price = 0;

            this.state.selectedServices.map(item => {
                observations += item.label+', ';

                // Calcular el monto a pagar
                this.state.servicesList.map(service => {
                    if(service.id == item.value){
                        price += parseFloat(service.price);
                    }
                });
            });
            this.setState({observations: observations.substring(0, observations.length-2)+'.', price: price.toFixed(2)});
        });
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

        let service_id = [];
        this.state.selectedServices.map(item => {
            service_id.push(item.value);
        });

        let params = {
            date: this.state.date,
            start: this.state.start,
            speciality_id: this.state.speciality_id,
            price: this.state.price,
            price_add: this.state.price_add,
            ajax: 1,
            specialist_id: this.state.specialist.id,
            customer_id: this.props.authLogin.user.customer.id,
            payment_type: this.state.payment_type,
            payment_account_id: this.state.paymentAccounts[this.state.accountSeleted].id,
            observations: this.state.observations ? this.state.observations : 'No definido',
            location: `${this.state.region.latitude},${this.state.region.longitude}`,
            service_id
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

        let payment_types = [1, 2];

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
        this.setState({ successModal: false, errorModal: false }, () => {
            this.props.navigation.navigate('TabMenu')
        })
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    changeStart = (hourValue) => {
        let date = new Date(hourValue);
        let start = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        let hour = start.substring(0, 2);
        let minutes = start.substring(3);

        this.setState({
            isDatePickerVisible: false,
        });

        if(minutes != '00' && minutes != '30'){
            Alert.alert(
                "Hora inválida",
                `Por favor elige un horario válido como: ${hour}:00 o ${hour}:30`,
                [
                    { text: "Entendido" }
                ]
            );
            return;
        }
        this.setState({
            start,
        });

        this.validateAppointment();
        
    };

    async validateAppointment(){
        this.setState({loading: true, appointmentsQueue: []});
        let params = {day: this.state.daySelected, start: this.state.start+':00'}

        let headers = {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authLogin.token}`
            },
        }

        let res = await fetch(`${env.API}/api/appointments/validate_appointment/${this.state.specialist.id}`, headers)
        .then(res => res.json())
        .then(res => res)
        .catch(error => ({'error': error}));

        if(res.success){
            this.setState({
                date: res.date,
                specialist: {
                    ...this.state.specialist,
                    status: 'programmer'
                }
            });
        }else{
            this.setState({
                specialist: {
                    ...this.state.specialist,
                    status: 0
                },
                appointmentsQueue: res.appointments_queue ? res.appointments_queue : [],
                errorMessage: res.error
            });
        }
        this.setState({loading: false});
    }

    handleDescription = () => {
        if(this.state.speciality_id == 3 && this.state.selectedServices.length == 0){
            showMessage({
                message: "Error",
                description: 'Debes seleccionar al menos un servicio de enfermería',
                type: "warning",
                icon: 'warning'
            });
            return;
        }

        this.setState({descriptionModal: true})
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <CardProfileHorizontal
                    speciality_id={ this.state.speciality_id }
                    name={this.state.specialist.full_name}
                    schedules={this.state.specialist.schedules}
                    location={this.state.specialist.location}
                    avatar={this.props.route.params.avatar}
                    price={this.state.price}
                    rating={this.props.route.params.rating}
                    available={this.state.specialist.status}
                    description={this.state.specialist.description}
                    onPress={ this.handleDescription }
                    CustomDateTimePicker={
                        <CustomDateTimePicker
                            isDatePickerVisible={ this.state.isDatePickerVisible }
                            hour={ this.state.start }
                            daySelected={ this.state.daySelected }
                            speciality_id={ this.state.speciality_id }
                            setDaySelected={(itemValue, itemIndex) => {
                                this.setState({daySelected: itemValue}, () => {
                                    if(this.state.modalTimePickerOpen){
                                        this.validateAppointment();
                                    }
                                });
                            }}
                            appointmentsQueue={ this.state.appointmentsQueue }
                            changeStart={ this.changeStart }
                            showDatePicker={ () => this.setState({isDatePickerVisible: true, modalTimePickerOpen: true}) }
                            hideDatePicker={ () => this.setState({isDatePickerVisible: false}) }
                            switch={
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#AAC7F9" }}
                                        thumbColor={this.state.priceAltSwitch ? "#5688DC" : "#f4f3f4"}
                                        onValueChange={ this.handleSwitch }
                                        value={this.state.priceAltSwitch}
                                    />
                                    <Text style={{marginTop: 15, fontSize: 13}}>Reconsulta</Text>
                                </View>
                            }
                            MapView={
                                <MapView
                                    ref={map => {this.map = map}}
                                    provider={PROVIDER_GOOGLE}
                                    style={styles.map}
                                    initialRegion={this.state.region}
                                >
                                    <Marker
                                        draggable
                                        onDragEnd={(e) => this.handleCurrentLocation(e.nativeEvent.coordinate)}
                                        title="Mi ubicación"
                                        description="Nuestra enfermera se dirijirá a ésta ubicación"
                                        coordinate={
                                            { 
                                            latitude: this.state.region.latitude,
                                            longitude: this.state.region.longitude
                                            }
                                        }
                                    />
                                </MapView>
                            }
                        />
                    }
                    checkBoxService={
                        <View style={{flex:1, marginTop: 10}}>
                            {this.state.services.length > 0 && <View style={{flex: 1, alignItems: 'center'}}><Text>Selecciona al menos un servicio</Text></View>}
                            
                            <SelectMultiple
                                items={this.state.services}
                                selectedItems={this.state.selectedServices}
                                onSelectionsChange={ this.selectMultipleChange }
                            />
                        </View>
                    }
                    
                    errorMessage={this.state.errorMessage}
                />

                {/* Modal description */}
                <PartialModal
                    animationType="slide"
                    visible={this.state.descriptionModal}
                    height={230}
                    onRequestClose={()=> this.setState({descriptionModal: false})}
                >
                    <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                        <TextInputAlt
                            label='Motivo de la consulta'
                            placeholder='Describe el motivo de tu consulta'
                            value={ this.state.observations }
                            onChangeText={ value => this.setState({observations: value}) }
                            multiline
                            numberOfLines={4}
                            maxLength={191}
                            style={{ height: 100 }}
                        />
                    </View>
                    <View style={{ alignItems: 'center', flexDirection: 'row', width: screenWidth }}>
                        <View style={{ width: '50%', paddingHorizontal: 20 }}> 
                            <ButtonBlock
                                icon='close-circle-outline'
                                title='Cancelar'
                                color='white'
                                borderColor='red'
                                colorText='red'
                                style={{ marginTop: 20 }}
                                onPress={ () => this.setState({descriptionModal: false}) }
                            />
                        </View>
                        <View style={{ width: '50%', paddingHorizontal: 20 }}>
                            <ButtonBlock
                                icon='checkmark-circle-outline'
                                title='Aceptar'
                                color={env.color.primary}
                                colorText='white'
                                style={{ marginTop: 20 }}
                                onPress={ () => this.setState({descriptionModal: false, paymentModal: true}) }
                            />
                        </View>
                    </View>
                </PartialModal>

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

                        {/* Tranferencia bancaria */}
                            <Collapse isCollapsed={ this.state.collapseStatus[0] } onToggle={ isCollapsed => this.collapseTabs(0, isCollapsed) } >
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
                                                {
                                                    env.about.phones.map(phone => 
                                                        <HyperLink key={phone.id} url={`whatsapp://send?phone=${phone.number}`} style={{ marginHorizontal: 10 }}>
                                                            +{phone.number}
                                                        </HyperLink>
                                                    )
                                                }
                                            </View>
                                        </AlertGradient>
                                        <View style={{ flex: 1, alignItems: 'center', padding: 10}}>
                                            <Text style={{fontSize: 25, color: '#858585'}}>Total: {this.state.price} Bs.</Text>
                                        </View>
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
                            {/* Pago con tajeta */}
                            {/* <Collapse isCollapsed={ this.state.collapseStatus[1] } onToggle={ isCollapsed => this.collapseTabs(1, isCollapsed) } >
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
                            </Collapse> */}
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
                    <View style={ styles.infoContent }>
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
                    <View style={ styles.infoContent }>
                        <Icon name='close-circle-outline' size={100} color='#DB3C3C' />
                        <Text style={{ fontSize: 30, color: '#767676' }}>Error!</Text>
                        <Text style={{ color: '#767676', textAlign: 'center' }}>Ocurrió un error inesperado, intenta nuevamente!.</Text>
                        <ButtonBlock
                            icon='arrow-back-circle-outline'
                            title='Volver'
                            color='#DB3C3C'
                            colorText='white'
                            style={{ marginVertical: 20 }}
                            onPress={ this.closeModalSuccess }
                        />
                    </View>
                </Modal>

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

const CustomDateTimePicker = props => {
    var daysName = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    var days = [{
        number: DATE.getDay(),
        name: daysName[DATE.getDay() -1]
    }];

    let cont = DATE.getDay() +1;
    for (let index = 0; index < 6; index++) {
        days.push({
            number: cont,
            name: daysName[cont -1]
        });
        if(cont == 7){
            cont = 1;
        }else{
            cont++;
        }
    }


    if(props.speciality_id == 3){
        return(
            <View style={{marginTop: 20, paddingBottom: 80}}>
                { props.MapView }
                <Text style={{color: '#858585'}}>Ésta ubicación será proporcianodad a la enfermera que te realizará el servicio.</Text>
            </View>
        );
    }
    return(
        <View style={{marginTop: 20, paddingBottom: 50}}>
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{width: '40%'}}>
                    <Picker
                        selectedValue={props.daySelected}
                        onValueChange={ props.setDaySelected }
                    >
                        {
                            days.map(day => <Picker.Item key={day.number} label={day.name} value={day.number} />)
                        }
                    </Picker>
                </View>
                <View style={{width: '30%', flexDirection: 'row'}}>
                    <View style={{width: '50%'}}>
                        <Text style={{paddingLeft: 10, marginVertical: 10, fontSize: 18}}>{ props.hour }</Text>
                    </View>
                    <View style={{width: '50%', marginTop: 5}}>
                        <TouchableOpacity onPress={ props.showDatePicker } >
                            <Icon name="stopwatch" color='#3b5998' size={30} />  
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{width: '40%'}}>
                    { props.switch }
                </View>
            </View>
            <View style={{textAligns: 'center'}}>
                <Text style={{color: '#3b5998', textAlign: 'center'}}>Puedes programar una consulta médica para otro momento, toca el reloj para cambiar la hora.</Text>
            </View>

            <View style={{marginVertical: 20, alignItems: 'center'}}>
                { props.appointmentsQueue.length != 0 && <Text>Citas médicas reservadas</Text>}
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{margin: 5, alignItems: 'center', flexDirection: 'row'}}>
                        {
                            props.appointmentsQueue.map(item => <Text key={item.id} style={{paddingHorizontal: 10, backgroundColor: '#EA352F', color: 'white', borderRadius: 10, margin: 5}}>{ item.start.substring(0, 5) } - { item.end.substring(0, 5) }</Text> )
                        }
                    </View>
                </ScrollView>
            </View>

            <DateTimePickerModal
                isVisible={ props.isDatePickerVisible }
                mode="time"
                onConfirm={ props.changeStart }
                onCancel={ props.hideDatePicker }
            />
        </View>
    );
}

// const Badge = () =>{

// }

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        height: 250,
        width: screenWidth
    },
    infoContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);