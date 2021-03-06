import React, {Component} from 'react';
import { Alert, Keyboard, StyleSheet, Platform, View } from 'react-native';
import { Formik } from 'formik';
import { Button, TextInput, Text } from 'react-native-paper';
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
      verificationId: '',
      code: ''
    };
  }

  constructor() {
    super();
    this.timeout = 20;
    this.state = SignUpScreen.getDefaultState();
  }

  render() {
    const phoneNumber = this.props.navigation.getParam('phoneNumber', 'no user found');
    const verificationId = this.props.navigation.getParam('verificationId', 'no verification Id found');
    const code = this.props.navigation.getParam('code', 'no code found');
    const SignupSchema = Yup.object().shape({
      email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    });
    return (
      <View style={styles.container}>
        <Text>Please fill in your email address:</Text>
        
        <Formik 
            initialValues={{ email: '' }}
            validationSchema={SignupSchema}
            onSubmit={values => {
                //Alert.alert(JSON.stringify(values.email, null, 2));
                Keyboard.dismiss();
                this.props.navigation.navigate('SignUpPartTwo',  {
                  email: values.email,
                  phoneNumber: phoneNumber,
                  verificationId: verificationId,
                  code: code
                });
              }
            }>
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <View>
              <TextInput
                onChangeText={handleChange('email')}
                value={values.email}
                label="Email"
                placeholder="Enter your email address.."
                onSubmitEditing={handleSubmit}
              />          
              {errors.email && touched.email ? (
                <View>
                  <Text style={styles.errorText}>{errors.email}</Text>
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
  errorText: {
    color: 'red',
    paddingTop: 5,
    paddingBottom: 5
  }
});