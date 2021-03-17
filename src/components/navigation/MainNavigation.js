// In App.js in a new project

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    BackHandler,
    Alert,
    DeviceEventEmitter,
    Modal,
    Dimensions,
    ImageBackground,
    ScrollView
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { showMessage } from "react-native-flash-message";
import { Rating, AirbnbRating } from 'react-native-ratings';

import Icon from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import IncomingCall from 'react-native-incoming-call';

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
import HyperLink from "../../UI/HyperLink";
import CallReturn from "../../UI/CallReturn";
import PartialModal from "../../UI/PartialModal";
import ButtonBlock from "../../UI/ButtonBlock";

// Firebase
import auth from '@react-native-firebase/auth';
import { LoginManager } from 'react-native-fbsdk';
import messaging from '@react-native-firebase/messaging';

// Configurations
import { env } from '../../config/env.js';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

const Stack = createStackNavigator();

function MainNavigation(props) {
  
    var [showMenu, handleMenu] = useState(false);
    var [showAlert, handleAlert] = useState(false);
    var [aboutModal, handleAboutModal] = useState(false);
    var [ratingModal, setRatingModal] = useState(false);
    var [ratingValue, setRatingValue] = useState(4);

    useEffect(() => {

        // messaging().getToken().then(token => console.log(token))

        // Listen to whether the token changes
        messaging().onTokenRefresh(token => {
            // console.log(token)
        });

        // Notificaciones en primer plano
        messaging().onMessage(async remoteMessage => {
            let info = remoteMessage.data;

            if(info.type == 'calling'){
                IncomingCall.display(
                    'callUUIDv4', // Call UUID v4
                    info.specialistName, // Username
                    info.specialistAvatar, // Avatar URL
                    'Llamada entrante', // Info text
                    30000 // Timeout for end call after 20s
                );

                // Listen to headless action events
                DeviceEventEmitter.addListener("endCall", async payload => {
                });
                
                DeviceEventEmitter.addListener("answerCall", (payload) => {
                    if (payload.isHeadless) {
                        // Called from killed state
                        IncomingCall.openAppFromHeadlessMode(payload.uuid);
                    } else {
                        // Called from background state
                        IncomingCall.backToForeground();
                        props.setCallInfo({
                            id: info.id,
                            url: info.url,
                            specialist: {
                                name: info.specialistName,
                                avatar: info.specialistAvatar
                            }
                        });
                        props.setCallInProgress(true);
                    }
                });
            }

            if(info.type == 'prescription_analysi'){
                showMessage({
                    message: "Nuevo historial",
                    description: info.message,
                    type: "success",
                    icon: 'success'
                });
            }

            if(info.type == 'accept_transfer'){
                showMessage({
                    message: info.title,
                    description: info.message,
                    type: "success",
                    icon: 'success'
                });
            }

            if(info.type == 'call_rating'){
                setRatingModal(true);
                props.setCallRating({
                    id: info.id
                });
                props.setCallInfo({});
                props.setCallInProgress(false);
            }
        });

    }, []);

    const setRating = async () => {
        
        let body = {
            'id': props.callRating.id,
            'user_id': props.authLogin.user.id,
            'rating': ratingValue
        }
        fetch(`${env.API}/api/meet/rating/store`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${props.authLogin.token}`
            }
        }).then(res => res.json())
        .then(res => {
            if(res.success){
                showMessage({
                    message: res.success,
                    description: res.message,
                    type: "success",
                    icon: 'success'
                });
            }else{
                showMessage({
                    message: res.error,
                    description: res.message,
                    type: "error",
                    icon: 'error'
                });
            }
            props.setCallRating({});
        })
        .catch(error => ({'error': error}));
        
        props.setCallRating({});
        setRatingModal(false);
    }

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
                        headerLeft: null
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
                    <TouchableOpacity onPress={ () => {handleMenu(false); handleAboutModal(true)}} style={{ height: 40 }}>
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

            {/* Modal about */}
            <Modal
                animationType="slide"
                visible={aboutModal}
                height={screenHeight}
                onRequestClose={()=> handleAboutModal(false)}
            >
                <ScrollView style={{ flex: 1 }}>
                    <ImageBackground source={env.images.banner} style={{ height: 200 }}>
                        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                            <Text style={{ color: 'white', fontSize: 25 }}>{ env.appName }</Text>
                        </View>
                    </ImageBackground>
                    <View style={{ margin: 10 }}>
                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>Misión</Text>
                            <Text style={{ color: env.color.textMuted }}>{ env.about.mision }</Text>
                        </View>
                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>Visión</Text>
                            <Text style={{ color: env.color.textMuted }}>{ env.about.vision }</Text>
                        </View>
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>Telefonos de contacto</Text>
                        {
                            env.about.phones.map(phone => 
                                <HyperLink key={phone.id} url={`whatsapp://send?phone=${phone.number}`} color={env.color.primary}>
                                    {phone.name}
                                </HyperLink>
                            )
                        }
                    </View>
                    <View style={{ margin: 10, marginBottom: 30 }}>
                        <Text style={{ marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>Sitio web</Text>
                        <HyperLink url='https://livemedic.net' color={env.color.primary}>
                            livemedic.net
                        </HyperLink>
                    </View>
                    <View style={{ margin: 10, marginBottom: 20 }}>
                        <Text style={{ textAlign: 'center' }}>Santísima Trinidad - Beni - Bolivia</Text>
                    </View>
                </ScrollView>
            </Modal>

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
            {
                props.callInProgress && <VideoCall />
            }

            {/* Llamada en proceso */}
            { (props.callInfo.url && !props.callInProgress) && <CallReturn />}

            {/* Rating */}
            {/* Modal description */}
            <PartialModal
                animationType="slide"
                visible={ ratingModal || props.callRating.id != undefined }
                height={ 250 }
                onRequestClose={ ()=> setRatingModal(false) }
            >
                <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                    <View style={{ marginTop: 5, alignItems: 'center' }}>
                        <Text style={{ color: env.color.textMuted, fontSize: 20 }}>Ayudanos a mejorar</Text>
                    </View>
                    <Rating
                        showRating={false}
                        // type='star'
                        ratingCount={5}
                        startingValue={ratingValue}
                        imageSize={40}
                        fractions={0}
                        onFinishRating={rating => setRatingValue(rating)}
                        style={{ paddingTop: 30, }}
                    />
                </View>
                <View style={{ flex:1, alignItems: 'center', flexDirection: 'column-reverse', width: screenWidth }}>
                    <View style={{ margin: 5 }}>
                        <Text style={{ color: env.color.textMuted, textAlign: 'center' }}>Por favor califica el servicio recibido por parte del médico que te atendío.</Text>
                    </View>
                    <ButtonBlock
                        icon='checkmark-circle-outline'
                        title='Puntuar'
                        colorText='white'
                        borderColor={ env.color.primary }
                        color={ env.color.primary }
                        style={{ marginTop: 20, width: screenWidth-50 }}
                        onPress={ setRating }
                    />
                </View>
            </PartialModal>

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

const mapStateToProps = (state) => {
    return {
        authLogin: state.authLogin,
        callInfo: state.callInfo,
        callRating: state.callRating,
        callInProgress: state.callInProgress
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCallInfo : (callInfo) => dispatch({
            type: 'SET_CALL_INFO',
            payload: callInfo
        }),
        setCallInProgress : (callInProgress) => dispatch({
            type: 'SET_CALL_IN_PROGRESS',
            payload: callInProgress
        }),
        setCallRating : (callRating) => dispatch({
            type: 'SET_CALL_RATING',
            payload: callRating
        }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);