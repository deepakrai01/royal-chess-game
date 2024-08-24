import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Logo from '../Assets/Images/Logo.svg';
import UserIcon from '../Assets/Images/userIcon.svg';
import FbLogo from '../Assets/Images/fbLogo.svg';
import GoogleLogo from '../Assets/Images/googleLogo.svg';
import LinearGradient from 'react-native-linear-gradient';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

const {height, width} = Dimensions.get('window');
const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '184172647792-5jd5kopstjjfg2ete9qr3vp8uvden3m7.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleButtonPress = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const response = await auth().signInWithCredential(googleCredential);
    if (response) {
      console.log('response in login screen :: ', response.additionalUserInfo);
      await AsyncStorage.setItem('isloggedIn', JSON.stringify(true));
      await AsyncStorage.setItem(
        'webLocalData',
        JSON.stringify({responseData: response, login_type: 'google'}),
      );
      navigation.replace('Web', {
        responseData: response,
        login_type: 'google',
      });
    }
  };

  const guestLogin = async () => {
    navigation.navigate('Web', {login_type: 'guest'});
  };

  async function onFacebookButtonPress() {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile']);
  
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }
  
      const data = await AccessToken.getCurrentAccessToken();
  
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
  
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
      const response = await auth().signInWithCredential(facebookCredential)
      if (response) {
        console.log('response in login screen :: ', response.additionalUserInfo);
        await AsyncStorage.setItem('isloggedIn', JSON.stringify(true));
        await AsyncStorage.setItem(
          'webLocalData',
          JSON.stringify({responseData: response, login_type: 'facebook'}),
        );
        navigation.replace('Web', {
          responseData: response,
          login_type: 'facebook',
        });
      }
    } catch (error) {
      console.error('Facebook login error: ', error);
    }
  }
  

  async function handleFacebookLogin() {
    LoginManager.logOut();
    onFacebookButtonPress().then('');
  }

  return (
    <View style={styles.mainContainer}>
      <Logo height={(width * 50) / 100} width={(width * 50) / 100} />
      <View style={styles.contentContainer}>
        <Text style={[styles.info, {fontWeight: 'bold'}]}>
          Login to get bonus gems and coins Save your stats!
        </Text>
        <LinearGradient
          colors={['rgba(26, 210, 251, 1)', 'rgba(10, 81, 133, 1)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.6}}
          style={styles.loginView}>
          <TouchableOpacity
            style={styles.btnView}
            activeOpacity={0.8}
            onPress={() => handleFacebookLogin()}>
            <View style={styles.logoView}>
              <FbLogo
                height={(width * 7) / 100}
                width={(width * 7) / 100}
                style={styles.itemsIcons}
              />
            </View>
            <Text style={styles.loginText}>Login With Facebook</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['rgba(246, 203, 108, 1)', 'rgba(178, 72, 13, 1)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.7}}
          style={styles.loginView}>
          <TouchableOpacity
            style={styles.btnView}
            activeOpacity={0.8}
            onPress={guestLogin}>
            <View style={styles.logoView}>
              <UserIcon
                height={(width * 7) / 100}
                width={(width * 7) / 100}
                style={styles.itemsIcons}
              />
            </View>
            <Text style={styles.loginText}>Guest Login</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['rgba(11, 205, 7, 1)', 'rgba(18, 97, 11, 1)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.6}}
          style={styles.loginView}>
          <TouchableOpacity
            style={styles.btnView}
            activeOpacity={0.8}
            onPress={() => onGoogleButtonPress()}>
            <View style={styles.logoView}>
              <GoogleLogo
                height={(width * 7) / 100}
                width={(width * 7) / 100}
                style={styles.itemsIcons}
              />
            </View>
            <Text style={styles.loginText}>Login With Google</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={[styles.info, {fontSize: 14}]}>
          By playing our game, you confirm you accept our privacy policy and
          terms and conditions.
        </Text>

        <View style={styles.privacyView}>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text style={{color: '#F2C243'}}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text style={{color: '#F2C243'}}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomModal
        setShowModal={data => setShowModal(data)}
        showModal={showModal}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33211B',
    paddingHorizontal: 20,
    gap: 40,
  },
  loginView: {
    width: '80%',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  btnView: {
    width: '100%',
    alignItems: 'flex-start',
    gap: 10,
    flexDirection: 'row',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    width: '75%',
    color: 'white',
  },
  loginText: {
    fontSize: 18,
    textAlign: 'center',
    // width: '80%',
    fontWeight: 'bold',
    color: 'white',
  },
  itemsIcons: {},
  logoView: {
    width: '15%',
    alignSelf: 'flex-start',
  },
  privacyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },

  /////////////////////////// Modal Styles //////////////////////////////////

  mainModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    zIndex: 10,
    position: 'absolute',
    top: 0,
  },
  modalDataView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataView: {
    height: '70%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
  },
  crossBtnView: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'absolute',
    top: -15,
    right: -15,
  },
});

const CustomModal = ({showModal, setShowModal}) => {
  return (
    <View style={styles.mainModalView}>
      <Modal transparent visible={showModal}>
        <View style={styles.modalDataView}>
          <LinearGradient
            colors={['rgba(209, 144, 68, 1)', 'rgba(154, 71, 40, 1)']}
            style={styles.dataView}>
            <ScrollView>
              <Text
                style={{
                  color: 'white',
                  fontWeight: '800',
                  fontSize: 18,
                  marginBottom: 10,
                }}>
                Terms and conditions
              </Text>
              <Text style={{color: 'white', fontSize: 16}}>
                The General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.The
                General Data Protection Regulation (GDPR) requires certain
                companies doing business in the European Union to designate a
                Data Protection Officer who people can contact for information
                about how their data is being processed. This contact
                information will be available to people on Facebook along with
                other information about your app or website. Learn More.
              </Text>
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.crossBtnView}
              onPress={() => setShowModal(false)}>
              <Text style={{fontWeight: '800', fontSize: 18}}>X</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};
