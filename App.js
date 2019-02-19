import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import PhoneInput from 'react-native-phone-input'
import firebase from 'react-native-firebase';
import {
  FIREBASE_API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  MESSAGE_ID
} from 'react-native-dotenv';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  /*componentWillMount() {
    firebase.initializeApp({
        apiKey: FIREBASE_API_KEY,
        authDomain: AUTH_DOMAIN,
        databaseURL: DATABASE_URL,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: MESSAGE_ID
    });
  }*/
  componentDidMount() {
    firebase.auth().languageCode = 'it';
  }

  render() {

    return (
      <ImageBackground source={require('./assets/background.png')} style={styles.containerBackground} >
        <SafeAreaView style={styles.container}>
          <View style={styles.topContainer}>
            <Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]}/>
          </View>
          <View style={styles.middleContainer}>
            {/* Insert Text Here */}
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.containerInputPhone}>
              <PhoneInput ref='phone' initialCountry='au' flagStyle={{width: 50, height: 30, borderWidth:0}} textStyle={{fontSize: 25, height: 40, borderBottomColor: '#a4a6aa', borderBottomWidth: 2}} textProps={{placeholder: 'Enter your Mobile Number'}}/>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  containerInputPhone:{
    backgroundColor: '#fff',
    height: 150,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 25,
  },
  middleContainer:{
    height: 300
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    textAlign: 'center',
    width: width
  }
});
