// In App.js in a new project

import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux';
import store from './store';

import FlashMessage from "react-native-flash-message";
import Navigation from './src/components/navigation/navigation';
import messaging from '@react-native-firebase/messaging';

import IncomingCall from 'react-native-incoming-call';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log(remoteMessage.data);
  await AsyncStorage.setItem('SessionCallInfo', JSON.stringify(remoteMessage.data));
  IncomingCall.display(
    'callUUIDv4', // Call UUID v4
    remoteMessage.data.specialistName, // Username
    remoteMessage.data.specialistAvatar, // Avatar URL
    'Llamada entrante', // Info text
    30000 // Timeout for end call after 20s
  );

  // Listen to headless action events
  DeviceEventEmitter.addListener("endCall", async payload => {
    // End call action here
    await AsyncStorage.setItem('SessionCallInfo', '{}');
  });
  DeviceEventEmitter.addListener("answerCall", (payload) => {
    console.log('answerCall', payload);
    if (payload.isHeadless) {
      // Called from killed state
      IncomingCall.openAppFromHeadlessMode(payload.uuid);
    } else {
      // Called from background state
      IncomingCall.backToForeground();
    }
  });
});

function App() {

  return (
    <Provider store={store}>
      <Navigation/>
      <FlashMessage position="top" duration={2300} />
    </Provider>
  );
}

export default App;