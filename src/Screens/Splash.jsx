import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Logo from '../Assets/Images/Logo.svg';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('window');

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    AsyncStorage.getItem('isloggedIn').then(data => {
      const jsonData = JSON.parse(data);
      console.log('is user logged in :: ,', jsonData);
      if (jsonData) {
        AsyncStorage.getItem('webLocalData').then(data => {
          const res = JSON.parse(data);
          // console.log('os user logged in :: ,', res);
          if (res) {
            setTimeout(() => {
              navigation.replace('Web', {
                responseData: res.responseData,
                login_type: res.login_type,
              });
            }, 2000);
          } else {
            setTimeout(() => {
              navigation.replace('Login');
            }, 2000);
          }
        });
      } else {
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      }
    });
  }, []);
  return (
    <LinearGradient
      colors={[
        'rgba(37, 14, 12, 1)',
        'rgba(132, 54, 42, 0.25)',
        'rgba(37, 14, 12, 1)',
      ]}
      style={styles.mainContainer}>
      {/* <Logo width={120} height={40} /> */}
      <Image
        source={require('../Assets/Images/Logo.png')}
        style={styles.logo}
      />
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33211B',
  },
  logo: {
    height: (width * 50) / 100,
    width: (width * 50) / 100,
    objectFit: 'contain',
  },
});
