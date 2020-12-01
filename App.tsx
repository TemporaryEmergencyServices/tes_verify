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
// import reducer from './reducers'
import rootReducer from './reducers'

const middleware = applyMiddleware(thunkMiddleware)
export const store = createStore(rootReducer, middleware)
// const store = createStore(rootReducer)
//End redux

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      //Provider wrapper and store area for redux
      <Provider store={store}>
        <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}