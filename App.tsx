import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import StackNavigation from './src/Navigations/StackNavigation';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={'#33211B'}
        barStyle={'light-content'}
      />
      <StackNavigation />
    </NavigationContainer>
  );
};

export default App;
