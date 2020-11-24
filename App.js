// In App.js in a new project

import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux';
import store from './store';

import FlashMessage from "react-native-flash-message";
import Navigation from './src/components/navigation/navigation';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(remoteMessage.data);
  await AsyncStorage.setItem('SessionCallComing', JSON.stringify(remoteMessage.data))
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