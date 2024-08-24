import {View, Text, StatusBar, Animated, PanResponder, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import SwitchOffButton from '../Assets/Images/switchOffButton.svg'

const Web = ({route}) => {
  const {responseData, login_type} = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const webViewRef = useRef(null);
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
      pan.setValue({x: 0, y: 0});
    },
  });

  useEffect(() => {
    if (responseData) {
      // console.log('response in webview : ', responseData);
      const data = {
        name: responseData.additionalUserInfo.profile.given_name,
        username: responseData.additionalUserInfo.profile.name,
        id: responseData.user.uid,
        email: responseData.additionalUserInfo.profile.email,
        login_type: login_type,
      };
      setUserInfo(data);
      // console.log('data in webview : ', data);
    }
    if (login_type === 'guest') {
      const data = {
        login_type: login_type,
      };
      setUserInfo(data);
    }
  }, [responseData]);

  const sendDataToWebView = () => {
    webViewRef.current.injectJavaScript(`
      window.receiveDataFromApp(${JSON.stringify(userInfo)});
    `);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#9F5A41'} barStyle={'light-content'} />
      {userInfo ? (
        <WebView
          ref={webViewRef}
          source={{uri: 'http://139.162.38.119'}}
          // source={{uri: 'http://192.168.29.68:3001'}}
          style={styles.webview}
          mixedContentMode="always"
          onLoadEnd={sendDataToWebView}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
          }}
        />
      ) : null}

      {/* <View style={styles.container}> 
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.floatingButton,
            {transform: pan.getTranslateTransform()},
          ]}>
          <View style={styles.button}>
            <SwitchOffButton height={45} width={45}/>
          </View>
        </Animated.View>
      </View> */}
    </SafeAreaView>
  );
};

export default Web;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },

  //////////////////////// For button ////////////////////////

  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 40, 
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'rgba(209, 144, 68, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
