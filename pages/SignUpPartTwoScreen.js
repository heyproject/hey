import React, {Component} from 'react';
import { Alert, Keyboard, StyleSheet, Platform, View } from 'react-native';
import { Formik } from 'formik';
import { Button, TextInput, Text } from 'react-native-paper';
import * as Yup from 'yup';
import firebase from 'react-native-firebase';
import { red } from 'ansi-colors';

export default class SignUpScreen extends React.Component {
  static getDefaultState() {
    return {
      error: '',
      auto: Platform.OS === 'android',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      email: ''
    };
  }

  constructor() {
    super();
    this.timeout = 20;
    this.state = SignUpScreen.getDefaultState();
  }

  render() {
    const user = this.props.navigation.getParam('user', 'no user found');
    const email = this.props.navigation.getParam('email', 'no email found');
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
                  this.props.navigation.navigate('User',  { 
                    user: user,
                    email: email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                  });
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