import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { showMessage } from "react-native-flash-message";
import { connect } from 'react-redux';

// UI
import BackgroundColor from "../../../UI/BackgroundColor";
import TextInputAlt from "../../../UI/TextInputAlt";
import ButtonBlock from "../../../UI/ButtonBlock";
import ClearFix from "../../../UI/ClearFix";
import OverlayLoading from "../../../UI/OverlayLoading";

// Config
import { env, strRandom } from "../../../config/env";

const Token = messaging().getToken().then(token => token._W);

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            last_name: '',
            phones: '',
            email: '',
            password: '',
            password_repeat: '',
            password_validate: false,
            loading: false
        }
    }

    // Validate password

    passwordValidate(value, key){
        this.setState({[key]: value}, () => {
            this.setState({ password_validate: this.state.password == this.state.password_repeat ? true : false });
        });
    }

    handleRegister = async () => {
        let paramans = {
            name: this.state.name,
            last_name: this.state.last_name,
            phones: this.state.phones,
            email: this.state.email,
            password: this.state.password,
            password_repeat: this.state.password_repeat,
            firebase_token: Token,
        }

        // Validar longitud del password
        if(paramans.password.length < 8){
            showMessage({
                message: "Error",
                description: 'Tu contraseña debe tener al menos 8 caracteres.',
                type: "warning",
                icon: 'warning'
            });
            return 0;
        }

        // Validar la contraseña repetida
        if(paramans.password != paramans.password_repeat){
            showMessage({
                message: "Error",
                description: 'La contraseña de validación no coincide.',
                type: "warning",
                icon: 'warning'
            });
            return 0;
        }

        if(paramans.name && paramans.email && paramans.password && paramans.password_repeat){
            this.setState({loading: true});
            let req = await fetch(`${env.API}/api/auth/register`, {
                method: 'POST',
                body: JSON.stringify(paramans),
                headers:{
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            }).then(res => res.json())
            .catch(error => ({'error': error}));

            if(req.user){
                this.setState({loading: false});
                this.props.setUser(req);
                AsyncStorage.setItem('SessionAuthLogin', JSON.stringify(req));
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'TabMenu' }],
                    key: null,
                });
            }else{
                this.setState({loading: false});
                showMessage({
                    message: "Error",
                    description: req.error ? req.error : 'Error desconocido.',
                    type: "danger",
                    icon: 'danger'
                });
            }
        }else{
            showMessage({
                message: "Error",
                description: 'Debe proprcionar al menos su nombre, email y password',
                type: "warning",
                icon: 'warning'
            });
        }
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <BackgroundColor
                    title='Registrarse'
                    backgroundColor='trabsparent'
                />
                <ScrollView style={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
                    <View style={ styles.form }>
                        <TextInputAlt
                            label='Nombres'
                            placeholder='Tu nombre o nombres'
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
                            value={ this.state.password }
                            onChangeText={ value => this.passwordValidate(value, 'password') }
                        />
                        <TextInputAlt
                            label='Repita su contraseña'
                            placeholder='Repita su contraseña'
                            password
                            value={ this.state.password_repeat }
                            onChangeText={ value => this.passwordValidate(value, 'password_repeat') }
                        />
                        { this.state.password_repeat != '' &&
                            <View style={{ marginHorizontal: 20 }}>
                                { !this.state.password_validate && <Text style={{ color: 'red', fontWeight: 'bold' }}>La contraseña no coincide</Text>}
                                { this.state.password_validate && <Text style={{ color: 'green', fontWeight: 'bold' }}>La contraseña es correcta</Text>}
                            </View>
                        }
                        <View style={{ margin: 20, marginTop: 30 }}>
                            <ButtonBlock
                                title='Registrarse'
                                color='white'
                                borderColor={ env.color.primary }
                                colorText={ env.color.primary }
                                onPress={ this.handleRegister }
                            />
                        </View>
                        <ClearFix height={50} />
                    </View>
                </ScrollView>
                { this.state.loading && <OverlayLoading title="Registrando..." />}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: env.color.primary 
    },
    form:{
        paddingTop: 20,
        backgroundColor: '#fff',
        borderRadius: 20
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        setUser : (authLogin) => dispatch({
            type: 'AUTH_LOGIN',
            payload: authLogin
        })
    }
}

export default connect(null, mapDispatchToProps)(Register);