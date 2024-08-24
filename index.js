/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

import {LoginManager, AccessToken, Settings} from 'react-native-fbsdk-next';

// Initialize Facebook SDK
Settings.initializeSDK();

AppRegistry.registerComponent(appName, () => App);
