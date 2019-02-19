import React from 'react';
import { Alert, TextInput, ActivityIndicator, StyleSheet, Platform, Image, Text, View, ImageBackground, SafeAreaView, Dimensions, Button } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import firebase from 'react-native-firebase';
import CodeInput from 'react-native-confirmation-code-input';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class App extends React.Component {
  static getDefaultState() {
    return {
      error: '',
      codeInput: '',
      phoneNumber: '',
      auto: Platform.OS === 'android',
      autoVerifyCountDown: 0,
      sent: false,
      started: false,
      user: null,
    };
  }

  constructor() {
    super();
    this.timeout = 20;
    this._autoVerifyInterval = null;
    this.state = App.getDefaultState();
  }

  _tick() {
    this.setState({
      autoVerifyCountDown: this.state.autoVerifyCountDown - 1,
    });
  }

    /**
   * Called when confirm code is pressed - we should have the code and verificationId now in state.
   */
  afterVerify = () => {
    const { codeInput, verificationId } = this.state;
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      codeInput
    );
    // TODO do something with credential for example:
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(userCred => {
        this.setState({ user: userCred.user });
      })
      .catch(console.error);
  };
  
  componentDidMount() {
    //firebase.auth().languageCode = 'it';
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState(
      {
        error: '',
        started: true,
        autoVerifyCountDown: this.timeout,
      },
      () => {
        firebase
          .auth()
          .verifyPhoneNumber(phoneNumber)
          .on('state_changed', phoneAuthSnapshot => {
            switch (phoneAuthSnapshot.state) {
              case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                // update state with code sent and if android start a interval timer
                // for auto verify - to provide visual feedback
                this.setState(
                  {
                    sent: true,
                    verificationId: phoneAuthSnapshot.verificationId,
                    autoVerifyCountDown: this.timeout,
                  },
                  () => {
                    if (this.state.auto) {
                      this._autoVerifyInterval = setInterval(
                        this._tick.bind(this),
                        1000
                      );
                    }
                  }
                );
                break;
              case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                // restart the phone flow again on error
                clearInterval(this._autoVerifyInterval);
                console.warn(phoneAuthSnapshot);
                break;

              // ---------------------
              // ANDROID ONLY EVENTS
              // ---------------------
              case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                clearInterval(this._autoVerifyInterval);
                this.setState({
                  sent: true,
                  auto: false,
                  verificationId: phoneAuthSnapshot.verificationId,
                });
                break;
              case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                clearInterval(this._autoVerifyInterval);
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
        <PhoneInput ref='phone' value={phoneNumber} onChangePhoneNumber={value => this.setState({ phoneNumber: value })} initialCountry='au' flagStyle={{width: 50, height: 30, borderWidth:0, marginBottom: 20}} textStyle={{fontSize: 25, height: 40, borderBottomColor: '#a4a6aa', borderBottomWidth: 2, marginBottom: 20}} textProps={{placeholder: 'Enter your Mobile Number'}}/>
        <Button
          title="Begin Verification"
          color="green"
          onPress={this.signIn}
        />
      </View>
    );
  }

  _onFinishCheckingCode(isValid, code) {
    if (!isValid) {
      Alert.alert(
        'Confirmation Code',
        'Code not match!',
        [{text: 'OK'}],
        { cancelable: false }
      );
      this.refs.codeInputRef1.clear();
    } else {
      this.setState({ codeInput: code })
    }
  }

  renderInputVerificationCode() {
    const { codeInput } = this.state;

    return (
      <View style={styles.bottomContainerBody}>
        <Text>Enter verification code below:</Text>
        <CodeInput
          ref="codeInputRef1"
          codeLength={6}
          keyboardType="numeric"
          compareWithCode='123456'
          activeColor='rgba(49, 180, 4, 1)'
          inactiveColor='rgba(49, 180, 4, 1.3)'
          autoFocus={true}
          ignoreCase={true}
          inputPosition='center'
          size={50}
          onFulfill={(isValid, code) => this._onFinishCheckingCode(isValid, code)}
          containerStyle={{ marginTop: 30 }}
          codeInputStyle={{ borderWidth: 1.5, fontSize: 20}}
        />
        <Button
          title="Confirm Code"
          color="#841584"
          onPress={this.afterVerify}
        />
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

  renderAutoVerifyProgress() {
    const {
      autoVerifyCountDown,
      started,
      error,
      sent,
      phoneNumber,
    } = this.state;
    if (!sent && started && !error.length) {
      return this.renderSendingCode();
    }
    return (
      <View style={styles.bottomContainerBody}>
        <Text style={{ paddingBottom: 25 }}>
          {`Verification code has been successfully sent to '${phoneNumber}'.`}
        </Text>
        <Text style={{ marginBottom: 25 }}>
          {`We'll now attempt to automatically verify the code for you. This will timeout in ${autoVerifyCountDown} seconds.`}
        </Text>
        <Button
          style={{ paddingTop: 25 }}
          title="I have a code already"
          color="green"
          onPress={() => this.setState({ auto: false })}
        />
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
  
  render() {
    const { started, error, codeInput, sent, auto, user } = this.state;
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
            {error && error.length ? this.renderError() : null}
          {!started && !sent ? this.renderInputPhoneNumber() : null}
          {started && auto && !codeInput.length
            ? this.renderAutoVerifyProgress()
            : null}
          {!user && started && sent && (codeInput.length || !auto) ?
            this.renderInputVerificationCode()
           : null}
          {user ? (
            <View style={styles.bottomContainerBody}>
              <Text>{`Signed in with user id: '${user.uid}'`}</Text>
            </View>
          ) : null}
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
