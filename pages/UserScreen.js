import React, {Component} from 'react';
import { StyleSheet, Platform, Text, View } from 'react-native';
import firebase from 'react-native-firebase';

export default class UserScreen extends React.Component {
  static getDefaultState() {
    return {
      error: '',
      auto: Platform.OS === 'android',
      user: ''
    };
  }

  constructor() {
    super();
    this.state = UserScreen.getDefaultState();
  }

  render() {
    const user = this.props.navigation.getParam('user', 'no user found');
    return (
      <View style={styles.container}>
      <Text>{`Signed in with user id: '${user.uid}'`}</Text>
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