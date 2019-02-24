import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Platform, Text, View } from 'react-native';
import firebase from 'react-native-firebase';

export default class UserScreen extends React.Component {
  static getDefaultState() {
    return {
      error: '',
      auto: Platform.OS === 'android',
      user: {}
    };
  }

  constructor() {
    super();
    this.state = UserScreen.getDefaultState();
  }

  componentDidMount() {
    const userParam = this.props.navigation.getParam('user', 'no user found');
    this.getUserData(userParam.phoneNumber);
  }

  getUserData = (phoneNumber) => {
    firebase.firestore().collection('users').where("phoneNumber", "==", phoneNumber).limit(1).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.warn(doc.id, "=>", doc.data());
        this.setState({user: doc.data()});
      });
    });
  }

  render() {
    const {user} = this.state;
    return (
      <View style={styles.container}>
      {user.firstName ? (<Text>Hey {user.firstName}!</Text>) : null}
      {!user ? (<ActivityIndicator animating style={{ padding: 50 }} size="large" />) : null}
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