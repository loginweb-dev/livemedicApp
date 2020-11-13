// In App.js in a new project

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux';
import store from './store';

import Icon from 'react-native-vector-icons/Ionicons';
import FlashMessage from "react-native-flash-message";
import AwesomeAlert from 'react-native-awesome-alerts';

// Views
import SplashScreen from "./src/UI/SplashScreen";
import Login from "./src/Views/Auth/Login/Login";
import Register from "./src/Views/Auth/Register/Register";
import Home from "./src/Views/Home/Home";
import Historial from "./src/Views/Historial/Historial";
import Config from "./src/Views/Config/Config";
import ProfileList from "./src/Views/ProfileList/ProfileList";
import ProfileView from "./src/Views/ProfileView/ProfileView";
import VideoCall from "./src/Views/VideoCall/VideoCall";

// UI
import DropDownMenu from "./src/UI/DropDownMenu";

// Firebase
import auth from '@react-native-firebase/auth';
import { LoginManager } from 'react-native-fbsdk';

const Stack = createStackNavigator();

function App() {
  
  var [showMenu, handleMenu] = useState(false);
  var [showAlert, handleAlert] = useState(false);

  const logOut = async () => {
    try {
      await auth().signOut();
      await LoginManager.logOut();
    } catch (error) {
      
    }
    await AsyncStorage.setItem('SessionUser', '{}')
    handleMenu(false);
    handleAlert(false);
    // Reset navigation y redireccionar al login
    BackHandler.exitApp();
  }

  return (
    <Provider store={store}>
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
              title: <Text>{route.params.speciality.title}</Text>,
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
              title: 'LiveMedic',
              headerTitle: props => <LogoTitle />,
              headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => handleMenu(true)}
              >
                <Icon name="ellipsis-vertical-sharp" size={30} />
              </TouchableOpacity>
            ),
            }}
            independent={true}
          />
        </Stack.Navigator>

        {/* Menu */}
        {
          showMenu &&
          <DropDownMenu>
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
            <TouchableOpacity onPress={ () => handleMenu(false)}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                <Text>Cerrar <Icon name="close-circle-outline" size={15} />  </Text>
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

        <FlashMessage position="top" duration={2300} />
      </NavigationContainer>
    </Provider>
  );
}


function LogoTitle() {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Image
        style={{ width: 40, height: 40 }}
        source={ require('./src/assets/images/icon.png') }
      />
      <Text style={{ marginLeft: 15, fontSize: 25 }}>LiveMedic</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function TabMenu() {
  return (
    <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#45A4C0',
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

export default App;