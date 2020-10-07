import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';


//The following are for redux
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer,middleware)
//End redux

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      //Provider wrapper and store are for redux
      <Provider store={store}>
        <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
        </SafeAreaProvider>
      </Provider>
      
    );
  }
}
