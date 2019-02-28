import React from 'react';
import { ActivityIndicator, StyleSheet, Platform, Image, Text, View, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import firebase from 'react-native-firebase';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class HomeScreen extends React.Component {
  static getDefaultState() {
    return {
      error: '',
      codeInput: '',
      phoneNumber: '',
      auto: Platform.OS === 'android',
      sent: false,
      started: false,
      user: null,
      cca2: 'AU',
      validPhoneNumber: false,
      countryPhoneNumber: '',
      loaded: false
    };
  }

  constructor() {
    super();
    this.timeout = 20;
    this.state = HomeScreen.getDefaultState();
    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount(){
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      // User is signed in.
      this.setState({
        user: true,
        loaded: true
      });
      this.props.navigation.navigate('User');
    } else {
      // No user is signed in.
      this.setState({
        loaded: true
      });
    }
  }

  onPressFlag() {
    this.countryPicker.openModal();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca2: country.cca2 });
  }
  
  updatePhoneNumberInfo(){
    this.setState({
          validPhoneNumber: this.phone.isValidNumber(),
          countryPhoneNumber: this.phone.getCountryCode(),
          phoneNumber: this.phone.getValue()
    })

    //unable to use state validPhoneNumber immediately. maybe there is a delay?
    if (this.phone.isValidNumber()){
      //allow sign in if the phone number is valid
      this.signIn()
    }else{
      this.setState({
        error: "Oops! Invalid Phone Number."
      })
    }
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState(
      {
        error: '',
        started: true
      },
      () => {
        firebase
          .auth()
          .verifyPhoneNumber(phoneNumber)
          .on('state_changed', phoneAuthSnapshot => {
            switch (phoneAuthSnapshot.state) {
              case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                // update state with code sent and if android start a interval timer
                  this.setState(
                  {
                    sent: true,
                    verificationId: phoneAuthSnapshot.verificationId,
                  },
                  () => this.props.navigation.navigate('VerificationCode',  { 
                    sent: true,
                    verificationId: phoneAuthSnapshot.verificationId,
                    phoneNumber: phoneNumber
                  })
                );
                break;
              case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                // restart the phone flow again on error
                console.warn(phoneAuthSnapshot);
                break;

              // ---------------------
              // ANDROID ONLY EVENTS
              // ---------------------
              case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                this.setState({
                  sent: true,
                  auto: false,
                  verificationId: phoneAuthSnapshot.verificationId,
                });
                break;
              case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                this.setState({
                  sent: true,
                  codeInput: phoneAuthSnapshot.code,
                  verificationId: phoneAuthSnapshot.verificationId,
                });
                break;
              default:
              // leave it blank
            }
          });
      }
    );
  };
  
  renderInputPhoneNumber() {
    const { phoneNumber } = this.state;
    return (
      <View style={styles.containerInputPhone}>
        <PhoneInput ref={(ref) => {
            this.phone = ref;
          }} onPressFlag={this.onPressFlag} allowZeroAfterCountryCode={false} value={phoneNumber} initialCountry={this.state.cca2.toLowerCase()} onChangePhoneNumber={value => this.setState({ phoneNumber: value })} flagStyle={{width: 50, height: 30, borderWidth:0, marginBottom: 20}} textStyle={{fontSize: 25, height: 40, borderBottomColor: '#a4a6aa', borderBottomWidth: 2, marginBottom: 20}} textProps={{placeholder: 'Enter your Mobile Number' , onSubmitEditing:this.updatePhoneNumberInfo.bind(this)}}/>
        <CountryPicker
          ref={(ref) => {
            this.countryPicker = ref;
          }}
          onChange={value => this.selectCountry(value)}
          translation="eng"
          cca2={this.state.cca2}
        >
          <View />
        </CountryPicker>
      </View>
    );
  }

  renderSendingCode() {
    const { phoneNumber } = this.state;

    return (
      <View style={styles.bottomContainerBody}>
        <Text style={{ paddingTop: 25 }}>
          {`Sending verification code to '${phoneNumber}'.`}
        </Text>
        <ActivityIndicator animating style={{ padding: 50 }} size="large" />
      </View>
    );
  }

  renderError() {
    const { error } = this.state;

    return (
      <View
        style={{
          padding: 10,
          borderRadius: 5,
          margin: 10,
          backgroundColor: 'rgb(255,0,0)',
        }}
      >
        <Text style={{ color: '#fff' }}>{error}</Text>
      </View>
    );
  }

  renderLoading() {
    return (
      <ActivityIndicator animating style={{ padding: 50 }} size="large" />
    );
  }

  render() {
    const { started, error, sent, loaded, user } = this.state;
    return (
      <View style={styles.mainContainer}>
        {!loaded ? this.renderLoading() : null }
        {loaded && !user ? (      
        <ImageBackground source={require('../assets/background.png')} style={styles.containerBackground} >
          <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
              <Image source={require('../assets/ReactNativeFirebase.png')} style={[styles.logo]}/>
            </View>
            <View style={styles.middleContainer}>
              {/* Insert Text Here */}
            </View>
            <View style={styles.bottomContainer}>
              {error && error.length ? this.renderError() : null}
            {!started && !sent ? this.renderInputPhoneNumber() : null}
            {started && !sent
              ? this.renderSendingCode()
              : null}
            </View>
          </SafeAreaView>
        </ImageBackground>
        ) : null }
    </View>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
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
  },
  bottomContainerBody:{
    backgroundColor: '#fff',
    height: 150,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 25
  }
});
