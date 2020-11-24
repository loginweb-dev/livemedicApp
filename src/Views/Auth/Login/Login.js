import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { showMessage } from "react-native-flash-message";

// Firebase
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';

// UI
import BackgroundColor from "../../../UI/BackgroundColor";
import TextInputAlt from "../../../UI/TextInputAlt";
import ButtonBlock from "../../../UI/ButtonBlock";

// Config
import { env, strRandom } from "../../../config/env";

GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '264229003943-5j3ta4d1997u73kfrsv3de705mokgmok.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
});

const Token = messaging().getToken().then(token => token);

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'admin3@admin.com',
            password: 'password'
        }
        console.log(Token._W)
    }

    onFacebookButtonPress = async () => {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccesToken
        AccessToken.getCurrentAccessToken()
        .then(async (data) => {
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
            // Sign-in the user with the credential
            auth().signInWithCredential(facebookCredential);

            // Get information from Facebook API 
            let userInfo = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${data.accessToken}`)
            .then(res => res.json())
            .then(res => res)
            .catch(error => ({'error': error}));

            let params = {
                name: userInfo.name,
                email: userInfo.email ? userInfo.email : `${userInfo.id}@loginweb.dev`,
                avatar: `http://graph.facebook.com/${userInfo.id}/picture?type=large`,
                password: strRandom(10),
                firebase_token: Token._W,
                social_login: 'facebook'
            }

            this.handleLogin(params);

        })
    }

    onGoogleButtonPress = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            let params = {
                name: userInfo.user.givenName,
                last_name: userInfo.user.familyName,
                email: userInfo.user.email,
                avatar: userInfo.user.photo,
                password: strRandom(10),
                firebase_token: Token._W,
                social_login: 'google'
            };
            this.handleLogin(params);

        } catch (error) {
            console.log(error)
        }
    }

    async manualLogin(){
        let params = {
            email: this.state.email,
            password: this.state.password,
            firebase_token: Token._W,
        };

        let req = await fetch(`${env.API}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => ({'error': error}));

        this.handleLogin(params);
    }

    async handleLogin(params){
        let req = await fetch(`${env.API}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => ({'error': error}));

        if(req.user){
            this.props.setUser(req);
            AsyncStorage.setItem('SessionAuthLogin', JSON.stringify(req));
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'TabMenu' }],
                key: null,
            });
        }else{
            showMessage({
                message: "Error",
                description: req.error ? req.error : 'Error desconocido.',
                type: "danger",
                icon: 'danger'
            });
        }
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <BackgroundColor
                    title='Login'
                    backgroundColor='transparent'
                />
                <ScrollView style={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
                    <View style={ styles.form }>
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
                            onChangeText={ value => this.setState({password: value}) }
                        />
                        <View style={{ margin: 20 }}>
                            <ButtonBlock
                                title='Iniciar sesión'
                                color='white'
                                borderColor='#3b5998'
                                colorText='#3b5998'
                                onPress={() => this.manualLogin()}
                            />
                        </View>
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            <Text style={{ color: '#B7B7B7' }}>O inicia sesión con tus redes sociales</Text>
                        </View>
                        <View style={{ padding: 30, paddingTop: 20}}>
                            <ButtonBlock
                                icon='ios-logo-facebook'
                                title='Login con Facebook'
                                color='#3b5998'
                                onPress={ this.onFacebookButtonPress }
                            />
                            <ButtonBlock
                                icon='ios-logo-google'
                                title='Login con Google'
                                color='red'
                                onPress={ this.onGoogleButtonPress }
                            />
                            <ButtonBlock
                                title='Registrarse'
                                color='transparent'
                                colorText='#45A4C0'
                                style={{ marginTop: 15 }}
                                onPress={() => this.props.navigation.navigate('Register')}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2A80DB'
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

export default connect(null, mapDispatchToProps)(Login);