// In App.js in a new project

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    BackHandler,
    Alert
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import NotificationSounds, { playSampleSound } from  'react-native-notification-sounds';

// Views
import SplashScreen from "../../UI/SplashScreen";
import Login from "../../Views/Auth/Login/Login";
import Register from "../../Views/Auth/Register/Register";
import Home from "../../Views/Home/Home";
import Historial from "../../Views/Historial/Historial";
import Config from "../../Views/Config/Config";
import ProfileList from "../../Views/ProfileList/ProfileList";
import ProfileView from "../../Views/ProfileView/ProfileView";
import VideoCall from "../../Views/VideoCall/VideoCall";

// UI
import DropDownMenu from "../../UI/DropDownMenu";

// Firebase
import auth from '@react-native-firebase/auth';
import { LoginManager } from 'react-native-fbsdk';
import messaging from '@react-native-firebase/messaging';

// Configurations
import { env } from '../../config/env.js';

const Stack = createStackNavigator();

function Navigation(props) {
  
    var [showMenu, handleMenu] = useState(false);
    var [showAlert, handleAlert] = useState(false);

    useEffect(() => {

        // messaging().getToken().then(token => console.log(token))

        // Listen to whether the token changes
        messaging().onTokenRefresh(token => {
            console.log(token)
        });

        // Notificaciones en primer plano
        messaging().onMessage(async remoteMessage => {
            let info = remoteMessage.data;

            props.setCallInfo({
                url: info.url,
                specialist: {
                    name: info.specialistName,
                    avatar: info.specialistAvatar
                }
            });
            props.setCallInProgress(true);
            NotificationSounds.getNotifications('ringtone').then(soundsList  => {
                // console.warn('SOUNDS', JSON.stringify(soundsList));
                playSampleSound(soundsList[0]);
            });
        });

    }, []);

    const logOut = async () => {
        try {
        await auth().signOut();
        await LoginManager.logOut();
        } catch (error) {
        
        }
        await AsyncStorage.setItem('SessionAuthLogin', '{}')
        handleMenu(false);
        handleAlert(false);
        // Reset navigation y redireccionar al login
        BackHandler.exitApp();
    }

return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="SplashScreen" component={SplashScreen}
                options={{
                    title: '',
                    headerTransparent: true,
                }}
            />
            <Stack.Screen
                name="Login" component={Login}
                options={{
                title: '',
                headerTransparent: true,
                }}
            />
            <Stack.Screen
                name="Register" component={Register}
                options={{
                title: '',
                headerTransparent: true,
                }}
            />
            <Stack.Screen
                name="ProfileList" component={ProfileList}
                options={({ route }) => ({
                title: <Text>{route.params.speciality.name}</Text>,
                })}
            />
            <Stack.Screen
                name="ProfileView" component={ProfileView}
                options={({ route }) => ({
                title: <Text>{route.params.specialist.name}</Text>,
                })}
            />
            <Stack.Screen
                name="VideoCall" component={VideoCall}
                options={{
                title: '',
                headerTransparent: true,
                }}
            />
            <Stack.Screen
                name="TabMenu" component={TabMenu}
                options={{
                    title: env.appName,
                    headerTitle: props => <LogoTitle />,
                    headerRight: () => (
                    <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => handleMenu(true)}
                    >
                        <Icon name="ellipsis-vertical-sharp" size={30} />
                    </TouchableOpacity>
                    ),
                    headerStyle: {
                        backgroundColor: env.color.primary,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
                independent={true}
            />
        </Stack.Navigator>
        {/* Menu */}
        {
            showMenu &&
            <DropDownMenu onPress={ () => handleMenu(false)}>
                <TouchableOpacity onPress={ () => handleMenu(false)} style={{ height: 40 }}>
                    <View style={{ height: 30 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}><Icon name="help-circle-outline" size={15} /> Ayuda</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => { handleAlert(true); handleMenu(false) } } style={{ height: 40 }}>
                    <View style={{  }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}><Icon name="exit-outline" size={15} /> Salir</Text>
                    </View>
                </TouchableOpacity>
            </DropDownMenu>
        }

        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Salir de LiveMedic"
            message="Deseas cerrar sesión?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="No, cancelar"
            confirmText="Si, cerrar sesión"
            confirmButtonColor="#3184BE"
            cancelButtonColor="#A2A2A2"
            onConfirmPressed={ logOut }
            onCancelPressed={() => handleAlert(false) }
        />
        </NavigationContainer>
    );
}


function LogoTitle() {
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image
                style={{ width: 40, height: 40 }}
                source={ require('../../assets/images/icon.png') }
            />
            <Text style={{ marginLeft: 15, fontSize: 25, marginTop: 5 }}>{env.appName}</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

function TabMenu() {
  return (
    <Tab.Navigator
        tabBarOptions={{
          activeTintColor: env.color.primary,
          inactiveTintColor: 'gray',
        }}
    >
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
            tabBarLabel: 'Inicio',
                tabBarIcon: ({ color }) => (
                    <Icon name="home" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen
            name="Historial"
            component={Historial}
            options={{
            tabBarLabel: 'Historial',
                tabBarIcon: ({ color }) => (
                    <Icon name="folder-outline" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen
            name="Profile"
            component={Config}
            options={{
            tabBarLabel: 'Perfil',
                tabBarIcon: ({ color }) => (
                    <Icon name="person-circle-outline" color={color} size={26} />
                ),
            }}  
        />
    </Tab.Navigator>
  );
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

export default connect(null, mapDispatchToProps)(Navigation);