import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

// Configurations
import { env } from '../config/env.js';

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true
        }
        this.bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    bootstrapAsync = async () => {
        this.props.setCallInfo({})
        const SessionAuthLogin = await AsyncStorage.getItem('SessionAuthLogin');
        let authLogin = SessionAuthLogin ? JSON.parse(SessionAuthLogin) : {};
        // console.log(authLogin)
        setTimeout(()=>{
            this.setState({
                isLoading: false
            }, () => {
                this.props.setUser(authLogin);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: authLogin.user ? 'TabMenu' : 'Login' }],
                    key: null,
                });
            });
        }, 2300);
    };

    render(){
        return (
            <View style={ style.container }>
                <Image 
                    source={ require('../assets/images/icon.png') }
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.title}>{env.appName}</Text>
                <View style={style.footer}>
                    <Text style={style.footerText}>Powered by <Text style={style.footerTextAutor}>{env.autor}</Text></Text>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Config.color.backgroundSplash,
    },
    logo: {
        flexDirection: 'column',
        width: 200,
        height: 200,
        marginBottom: 10
    },
    title: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom:10,
        // color: Config.color.backgroundSplashText
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30
    },
    footerText: {
        textAlign: 'center',
        fontSize: 15,
        // color: Config.color.backgroundSplashText
    },
    footerTextAutor: {
        fontWeight: 'bold'
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        setUser : (authLogin) => dispatch({
            type: 'AUTH_LOGIN',
            payload: authLogin
        }),
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

export default connect(null, mapDispatchToProps)(SplashScreen);