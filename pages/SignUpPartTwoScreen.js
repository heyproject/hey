import React, {Component} from 'react';
import { Keyboard, StyleSheet, Platform, View } from 'react-native';
import { Formik } from 'formik';
import { TextInput, Text } from 'react-native-paper';
import * as Yup from 'yup';
import firebase from 'react-native-firebase';

export default class SignUpScreen extends React.Component {
  static getDefaultState() {
    return {
      error: '',
      auto: Platform.OS === 'android',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      user: {}
    };
  }

  constructor() {
    super();
    this.timeout = 20;
    this.state = SignUpScreen.getDefaultState();
  }


  render() {
    const email = this.props.navigation.getParam('email', 'no email found');
    const phoneNumber = this.props.navigation.getParam('phoneNumber', 'no phone number found');
    const verificationId = this.props.navigation.getParam('verificationId', 'no verification Id found');
    const code = this.props.navigation.getParam('code', 'no code found');

    const SignupSchema = Yup.object().shape({
      firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
      lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required')
    });

    return (
      <View style={styles.container}>
        <Text>Please fill in a few details below:</Text>
        
        <Formik 
            initialValues={{ firstName: '', lastName: '' }}
            validationSchema={SignupSchema}
            onSubmit={values => {
                //Alert.alert(JSON.stringify(values, null, 2));
                Keyboard.dismiss();
                if (values.firstName != '' && values.lastName != ''){

                  const credential = firebase.auth.PhoneAuthProvider.credential(
                    verificationId,
                    code
                  );

                  // Sign in with Credential
                  firebase
                    .auth()
                    .signInWithCredential(credential)
                    .then(userCred => {
                      //add the user to the database
                      var addProvider = {};
                      addProvider[userCred.user.providerData[0].providerId] = userCred.user.uid;
                      var userData = {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: email,
                        phoneNumber: phoneNumber,
                        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
                        provider: addProvider
                      }
                      firebase.firestore().collection('users').add(userData);

                      this.props.navigation.navigate('User');
                    })
                    .catch(console.error);
                }
              }
            }>
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <View>
              <TextInput
                onChangeText={handleChange('firstName')}
                value={values.firstName}
                label="First name"
                placeholder="Enter your first name.."
                onSubmitEditing={handleSubmit}
              />          
              {errors.firstName && touched.firstName && values.firstName != ''? (
                <View>
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                </View>
              ) : null}
              <TextInput
                onChangeText={handleChange('lastName')}
                value={values.lastName}
                label="Last name"
                placeholder="Enter your last name.."
                onSubmitEditing={handleSubmit}
              />          
              {errors.lastName && touched.lastName && values.lastName != '' ? (
                <View>
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                </View>
              ) : null}
              </View>
            )}
          </Formik>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  content: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    paddingTop: 5,
    paddingBottom: 5
  }
});