import React, {Component} from 'react';
import { Dimensions, SafeAreaView, ActivityIndicator, StyleSheet, Platform, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import firebase from 'react-native-firebase';
import UserMenu from '../components/UserMenu';

var width = Dimensions.get('window').width; //full width

export default class UserScreen extends React.Component {
  static getDefaultState() {
    return {
      error: '',
      auto: Platform.OS === 'android',
      user: {},
      loaded: false,
      user_uid: ''
    };
  }

  constructor() {
    super();
    this.state = UserScreen.getDefaultState();
  }

  componentDidMount(){
    var that = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        const userProvider = user.providerData[0].providerId;
        const userData = firebase.firestore().collection('users').where("provider."+userProvider, "==", user.uid).get();
        userData.then(snapshot => {
          if (!snapshot.empty){
            snapshot.forEach(doc => {
              that.setState({
                user_uid: doc.id,
                user: doc.data(),
                loaded: true
              });
            })
          }else{
            // No data found
            firebase.auth().signOut();
            that.props.navigation.navigate('Home');
          }
        });
        
      } else {
        // No user is signed in.
        that.props.navigation.navigate('Home');
      }
    });
    
  }

  renderLoading() {
    return (
      <ActivityIndicator animating style={{ padding: 50 }} size="large" />
    );
  }

  renderSignOutButton() {
    var that = this;
    return(
      <Button mode="contained" onPress={() => 
        firebase.auth().signOut().then(function() {
          that.props.navigation.navigate('Home');
        //console.warn('Signed Out');
      }, function(error) {
        console.warn('Sign Out Error', error);
      })}>
      Sign Out
    </Button>
    );
  }

  render() {
    const {loaded, user} = this.state;
    return (

      <View style={[styles.mainContainer]}>
        <View style={styles.menuContainer}>
          <UserMenu>
          </UserMenu>
        </View>
        <SafeAreaView style={styles.container}>
          <View style={styles.topContainer}>
            {/* */}
          </View>
          <View style={styles.middleContainer}>
          {loaded ? (
          <Text>Hey {user.firstName}!</Text>
          ) : null}
          {!loaded && !user.firstName ? this.renderLoading() : null}
          </View>
          <View style={styles.bottomContainer}>
          {loaded
            ? this.renderSignOutButton()
            : null}
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    textAlign: 'center',
    width: width
  },
  middleContainer:{
    height: 300
  },
  topContainer:{
    height: 200
  }
});