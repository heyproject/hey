import React, {Component} from 'react';
import { Alert, StyleSheet, Platform, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import CodeInput from 'react-native-confirmation-code-input';

export default class VerificationCodeScreen extends React.Component {
  static getDefaultState() {
    return {
      error: '',
      auto: Platform.OS === 'android',
      sent: '',
      user: ''
    };
  }

  constructor() {
    super();
    this.timeout = 20;
    this.state = VerificationCodeScreen.getDefaultState();
  }

  _onFinishCheckingCode(isValid, code, verificationId) {
    
    if (!isValid) {
      Alert.alert(
        'Confirmation Code',
        'Code not match!',
        [{text: 'OK'}],
        { cancelable: false }
      );
      this.refs.codeInputRef1.clear();
    } else {

      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      // Sign in with Credential
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(userCred => {
          this.props.navigation.navigate('User',  { 
            user: userCred.user
          });
        })
        .catch(console.error);
    }
  }

  render() {
    const sent = this.props.navigation.getParam('sent', 'no verification ID')
    const verificationId = this.props.navigation.getParam('verificationId', 'no verification ID');
    return (
      <View style={styles.container}>
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
          onFulfill={(isValid, code) => this._onFinishCheckingCode(isValid, code, verificationId)}
          containerStyle={{ marginTop: 30 }}
          codeInputStyle={{ borderWidth: 1.5, fontSize: 20}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});