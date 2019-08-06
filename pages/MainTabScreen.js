import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Animated, AppRegistry, StyleSheet, TextInput,View, Alert, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, ScrollView, FlatList, ActivityIndicator, DatePickerIOS, NavigatorIOS, Constants, StatusBar, Dimensions, colors, Text, Keyboard, YellowBox} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MapView, {PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Badge, ListItem, Left, Right, Body, List, Title} from 'native-base';
import {Fonts, Ionicons, Icons} from 'react-native-vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import MapViewDirections from 'react-native-maps-directions';
import _ from 'lodash';
import PolyLine from "@mapbox/polyline";
// import firebase, { Firebase } from 'react-native-firebase';
import * as firebase from 'react-native-firebase';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Swipeable from 'react-native-swipeable';
// import FirebaseStorage from 'Firebase/Storage';

// import Card from '../components/Card'

import Card1 from '../components/Cardfavourites'
import Card2 from '../components/Carditalian'
import Card3 from '../components/Cardkorean'
import Card4 from '../components/Cardspecials'
import CardList from '../components/CardList'



const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

//Geocoder.init('AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE'); // initialize the geocoder



const {
    RNSpeechToText
} = NativeModules

const leftContent = <Text>Pull to activate</Text>;
 
const rightButtons = [
  <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
  <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
];

const imageWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
                                 mapContainer: {
                                 height: '100%'//imageWidth * (3 / 3),
//                                 backgroundColor: colors.$primaryWhite
                                 },
                                 map: {
                                 height: '100%'//imageWidth * (3 / 3)
                                 },
                                 locationSuggestions: {
                                 backgroundColor: 'white',
                                 padding: 10,
                                 fontSize: 16,
                                 borderWidth: 0.5,
                                 marginLeft: 40,
                                 marginRight: 40
                                 },
                                 destinationInput: {
                                 height: 40,
                                 borderWidth: 0.5,
                                 marginLeft: 40,
                                 marginRight: 40,
                                 marginTop: 20,
                                 padding: 10,
                                 backgroundColor: 'white'
                                 },
                                 pickupInput: {
                                 height: 40,
                                 borderWidth: 0.5,
                                 marginLeft: 40,
                                 marginRight: 40,
                                 marginTop: 60,
                                 padding: 10,
                                 backgroundColor: 'white'
                                 },
                                 calloutView: {
                                 flexDirection: "row",
                                 backgroundColor: "rgba(255, 255, 255, 0.9)",
                                 borderRadius: 10,
                                 width: "40%",
                                 marginLeft: "30%",
                                 marginRight: "30%",
                                 marginTop: 20,
//                                 marginHorizontal: 50,
                                 marginTop: '10%',
//                                 position: 'absolute',
                                 },
                                 calloutSearch: {
                                 borderColor: "transparent",
//                                 left: 10,
                                 marginHorizontal: 50,
                                 width: "90%",
//                                 right: 10,
                                 height: 40,
                                 borderWidth: 0.0,
                                 marginTop: StatusBar.currentHeight,
                                 justifyContent: 'center',
//                                 position: 'absolute',
                                 },
                                 calloutView2: {
                                 flexDirection: "row",
                                 backgroundColor: "rgba(255, 255, 255, 0.9)",
                                 borderRadius: 10,
                                 width: "70%",
                                 //                                 marginLeft: "30%",
                                 //                                 marginRight: "30%",
                                 marginTop: 200,
                                 marginHorizontal: 50,
//                                 marginTop: '60%',
                                 },
                                 calloutSearch2: {
                                 borderColor: "transparent",
                                 //                                 left: 10,
                                 marginHorizontal: 50,
                                 width: "90%",
                                 //                                 right: 10,
                                 height: 40,
                                 borderWidth: 0.0,
                                 marginTop: 200,
                                 justifyContent: 'center'
                                 },
                                //  container: {
                                //   flex: 1,
                                //   paddingTop: 20
                                //   },
                                 listItem: {
                                    height: 75,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    left: -15,
                                  },
                                  leftSwipeItem: {
                                    flex: 1,
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    paddingRight: 20
                                  },
                                  rightSwipeItem: {
                                    flex: 1,
                                    justifyContent: 'center',
                                    paddingLeft: 20
                                  },
                                  scrollViewContainer: {
                                    flex: 1,
                                    backgroundColor: '#eee',
                                    marginTop: 100,
                                  },
                                  card: {
                                    marginRight: 10
                                  },
                                  container: {
                                    flex: 1,
                                    backgroundColor: '#eee',
                                    marginTop: StatusBar.currentHeight,
                                  },
                                 });


const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO


export default class MainTabScreen extends Component <Props> {
    static navigationOptions = {
    title: 'MainTabScreen',
    };
    static getDefaultState() {
        return {
        error: '',
        auto: Platform.OS === 'android',
        user: {},
        loaded: false,
        user_uid: ''
        };
    };

    
    constructor(props) {
        super(props);
        // console.log("MenuScreen constructor start");
        // this.didFocusListener = this.props.navigation.addListener(
        //         'didFocus',
        //         (obj) => {console.log("MenuScreen didFocus start")}
        //     );
        // this.didBlurListener = this.props.navigation.addListener(
        //         'didBlur',
        //         (obj) => {console.log('MenuScreen didBlur start')}
        //     );
        this.timeout = 20;
        this.state = {
        user: "",
        JobData: "",
        Jobs: [],
        items: [],
        itemsID: [],
        myfavitems: [],
        myfavitemsID: [],
        myfavitemID: [],
        italianitems: [],
        italianitemsID: [],
        koreanitems: [],
        koreanitemsID: [],
        specialdealitems: [],
        specialdealitemsID: [],
        items_array: [],
        Provider:"",
        itemID: [],
        itemID_array: [],
        Jobdetails: "",
        JobID: [],
        Job: [],
        Username: [],
        currentUser: "",
        leftActionActivated: false,
        toggle: false,
        currentlyOpenSwipeable: null,
        loading: true,
        mounted: true,
        image: "/Products/holland-martabak.jpg",
        url: "",
        a:"",
        };
    }
    
    componentDidMount() {
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
                                        //    console.warn(user.uid);
                                           } else {
                                           // No user is signed in.
                                           that.props.navigation.navigate('Home');
                                           }
                                           });
    //    this.getJob();

       this.setState({ isMounted: true });

       this.getmyfavProduct();

       this.getitalianProduct();
       
       this.getkoreanProduct();

       this.getspecialdealProduct();
    }
    
    componentWillUnmount() {
        this.setState({ isMounted: false });
        // console.warn(1);
    }

    componentWillReceiveProps(props) {
        this.props = props
        if (this.props.refresh == true) {
            console.warn(2);
        }
    }


    async getmyfavProduct()
    { 
      if (this.state.mounted == true) {
      const db = firebase.firestore();
            db.settings({ timestampsInSnapshots: true});
                    const query = db.collection('Products').where('available', '==', 'Y').limit(10);
                    const snapshot = await query.get();

                    const items = snapshot.docs.map(
                      doc => doc.data(),
                      // photoID = i + 1, 
                    );
                    
                    // photoID = i + 1;
                        // console.warn(items);
                    // const itemsID = snapshot.docs.map(doc => doc.id);
                    var itemsID = snapshot.docs.map(
                      doc => doc.data().imagepath,
                      
                      );

                      const itemID = snapshot.docs.map(
                        doc => doc.id,
                        // photoID = i + 1, 
                      );

                      this.setState({ myfavitems: items,
                                      myfavitemsID: itemsID,
                                      myfavitemID: itemID
                      });
                //    console.warn(Math.round(Math.random()*100));
                  }
    };
        

    async getitalianProduct()
    { 
      if (this.state.mounted == true) {
      const db = firebase.firestore();
            db.settings({ timestampsInSnapshots: true});
                    const query = db.collection('Products').where('available', '==', 'Y').where('productcategory', '==', 'Italian').limit(10);
                    const snapshot = await query.get();

                    const items = snapshot.docs.map(
                      doc => doc.data(),
                      // photoID = i + 1, 
                    );
                    
                    // photoID = i + 1;
                        // console.warn(items);
                    // const itemsID = snapshot.docs.map(doc => doc.id);
                    var itemsID = snapshot.docs.map(
                      doc => doc.data().imagepath,
                      
                      );

                      const itemID = snapshot.docs.map(
                        doc => doc.id,
                        // photoID = i + 1, 
                      );

                      this.setState({ italianitems: items,
                                    italianitemsID: itemsID,
                                    italianitemID: itemID
                      });
                   
                  }
    };

    async getkoreanProduct()
    { 
      if (this.state.mounted == true) {
      const db = firebase.firestore();
            db.settings({ timestampsInSnapshots: true});
                    const query = db.collection('Products').where('available', '==', 'Y').where('productcategory','==','Korean');
                    const snapshot = await query.get();

                    const items = snapshot.docs.map(
                      doc => doc.data(),
                      // photoID = i + 1, 
                    );
                    
                    // photoID = i + 1;
                        // console.warn(items);
                    // const itemsID = snapshot.docs.map(doc => doc.id);
                    var itemsID = snapshot.docs.map(
                      doc => doc.data().imagepath,
                      
                      );

                      const itemID = snapshot.docs.map(
                        doc => doc.id,
                        // photoID = i + 1, 
                      );

                      this.setState({ koreanitems: items,
                                    koreanitemsID: itemsID,
                                    koreanitemID: itemID
                      });
                   
                  }
    };

    async getspecialdealProduct()
    { 
      if (this.state.mounted == true) {
      const db = firebase.firestore();
            db.settings({ timestampsInSnapshots: true});
                    const query = db.collection('Products').where('available', '==', 'Y').where('specialdeals','==','Y');
                    const snapshot = await query.get();

                    const items = snapshot.docs.map(
                      doc => doc.data(),
                      // photoID = i + 1, 
                    );
                    
                    // photoID = i + 1;
                        // console.warn(items);
                    // const itemsID = snapshot.docs.map(doc => doc.id);
                    var itemsID = snapshot.docs.map(
                      doc => doc.data().imagepath,
                      
                      );

                      const itemID = snapshot.docs.map(
                        doc => doc.id,
                        // photoID = i + 1, 
                      );

                      this.setState({ specialdealitems: items,
                                    specialdealitemsID: itemsID,
                                    specialdealitemID: itemID
                      });
                   
                  }
    };
        

    // };

   

    swipeable = null;
 
        handleUserBeganScrollingParentView() {
            this.swipeable.recenter();
        };
        
    handleSwipe = () => {
            const {currentlyOpenSwipeable} = this.state;
        
    if (!currentlyOpenSwipeable) {
        console.warn(currentlyOpenSwipeable);
              currentlyOpenSwipeable.recenter();
            }
          };
    
    render() {
        const {leftActionActivated, toggle} = this.state;
        // console.warn(this.props.navigation.state);

        if (this.state.myfavitems.length == 0 ) {
            return null
          } else {
            console.log(this.state.myfavitems);
          }

        if (this.state.italianitems.length == 0 ) {
            return null
          } else {
            console.log(this.state.italianitems);
          }  

        if (this.state.koreanitems.length == 0 ) {
            return null
          } else {
            console.log(this.state.koreanitems);
          }  

        if (this.state.specialdealitems.length == 0 ) {
            return null
          } else {
            console.log(this.state.specialdealitems);
          }  


        // const itemID = this.state.itemID[0];
        // const JobID = itemID;
        // const Username = JSON.stringify(this.state.items.UserName);

        const currentUser = firebase.auth().currentUser;

        // let Username2 = this.state.items;

        // if (!this.state.user_uid == false){
        //     // console.warn(this.state.user_uid);
        //     const user = this.state.user_uid
        // };

        // const config = {
        //     velocityThreshold: 0.3,
        //     directionalOffsetThreshold: 80
        //   };

        // const {currentlyOpenSwipeable} = this.state;
        // // console.warn(currentlyOpenSwipeable);
        // const itemProps = {
        //                     onOpen: (event, gestureState, swipeable) => {
        //                     if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
        //                     currentlyOpenSwipeable.recenter();
        //                     }
                            
        //                     this.setState({currentlyOpenSwipeable: swipeable});
        //                 },
        //                 onClose: () => this.setState({currentlyOpenSwipeable: null})
        //                 };

        //   const rightButtons = [
        //           <TouchableHighlight>
        //               <Text>
        //                 Button 1
        //               </Text>
        //           </TouchableHighlight>,
        //           <TouchableHighlight>
        //               <Text>
        //                 Button 2
        //               </Text>
        //           </TouchableHighlight>,
        // ];

        // if (this.state.mounted == true) {
        //     if (this.state.loading == true) {
        //         return (
        //             <View key={this.state.image} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }} >
        //                 <ActivityIndicator />
        //             </View>
        //         )
        //     }
        //     else {
        //         return (
        //             <Image style={this.props.style} source={{uri: this.state.url}} />
        //         )
        //     }
        // }
        // else {
        //     return null
        // }
          
        return(
               (<p>{ this.state.items || 'Loading' }</p>),

               <Container>
               {/* <Header>
                   <Left style={{left: 20}}>
                      <TouchableHighlight
                       onPress={() => this.getJob()}
                       >
                            <Text >
                                Request Job
                            </Text>
                       </TouchableHighlight>
                   </Left>
                   <Body>
                        <Title>Job Offer</Title>
                   </Body>
                   <Right style={{right: 20}}>
                        <Button hasText transparent
                        onPress={() => this.acceptall()}
                        >
                            <Text>
                                Accept All
                            </Text>
                        </Button>
                   </Right>
               </Header> */}
             
               <Content>
                        {/* <GestureRecognizer
                        // onSwipe={(direction, state) => this.getJob()}
                        onSwipeUp={(state) => this.getJob()}
                        onSwipeDown={(state) => this.getJob()}
                        // onSwipeLeft={(state) => this.getJob()}
                        // onSwipeRight={(state) => this.getJob()}
                        config={config}
                        > */}

            <View style={styles.container}>
                    <ScrollView style={styles.scrollViewContainer}>
                        <View style={{ paddingTop: 10 }}>
                            <CardList title={'My Favourites'}>
                                <If condition={this.state.myfavitems.length > 0}>
                                    <Card1 style={styles.card} a={this.state.myfavitems[0]} b={this.state.myfavitemID[0]}/>
                                </If>
                                <If condition={this.state.myfavitems.length > 1}>
                                    <Card1 style={styles.card} a={this.state.myfavitems[1]} b={this.state.myfavitemID[1]}/>
                                </If>
                                <If condition={this.state.myfavitems.length > 2}>
                                    <Card1 style={styles.card} a={this.state.myfavitems[2]} b={this.state.myfavitemID[2]}/>
                                </If>
                                <If condition={this.state.myfavitems.length > 3}>
                                    <Card1 style={styles.card} a={this.state.myfavitems[3]} b={this.state.myfavitemID[3]}/>
                                </If>
                                <If condition={this.state.myfavitems.length > 4}>
                                    <Card1 style={styles.card} a={this.state.myfavitems[4]} b={this.state.myfavitemID[4]}/>
                                </If>
                                <If condition={this.state.myfavitems.length > 5}>
                                    <Card1 style={styles.card} a={this.state.myfavitems[5]} b={this.state.myfavitemID[5]}/>
                                </If>
                                <If condition={this.state.myfavitems.length > 6}>
                                    <Card1 style={styles.card} a={this.state.myfavitems[6]} b={this.state.myfavitemID[6]}/>
                                </If>
                            </CardList>
                            <CardList title={'Italian foods'}>
                                <If condition={this.state.italianitems.length > 0}>
                                    <Card2 style={styles.card} a={this.state.italianitems[0]} b={this.state.italianitemID[0]}/>
                                </If>
                                <If condition={this.state.italianitems.length > 1}>
                                    <Card2 style={styles.card} a={this.state.italianitems[1]} b={this.state.italianitemID[1]}/>
                                </If>
                                <If condition={this.state.italianitems.length > 2}>
                                    <Card2 style={styles.card} a={this.state.italianitems[2]} b={this.state.italianitemID[2]}/>
                                </If>
                                <If condition={this.state.italianitems.length > 3}>
                                    <Card2 style={styles.card} a={this.state.italianitems[3]} b={this.state.italianitemID[3]}/>
                                </If>
                                <If condition={this.state.italianitems.length > 4}>
                                    <Card2 style={styles.card} a={this.state.italianitems[4]} b={this.state.italianitemID[4]}/>
                                </If>
                                <If condition={this.state.italianitems.length > 5}>
                                    <Card2 style={styles.card} a={this.state.italianitems[5]} b={this.state.italianitemID[5]}/>
                                </If>
                                <If condition={this.state.italianitems.length > 6}>
                                    <Card2 style={styles.card} a={this.state.italianitems[6]} b={this.state.italianitemID[6]}/>
                                </If>
                            </CardList>
                            <CardList title={'Korean foods'}>
                                <If condition={this.state.koreanitems.length > 0}>
                                    <Card3 style={styles.card} a={this.state.koreanitems[0]} b={this.state.koreanitemID[0]}/>
                                </If>
                                <If condition={this.state.koreanitems.length > 1}>
                                    <Card3 style={styles.card} a={this.state.koreanitems[1]} b={this.state.koreanitemID[1]}/>
                                </If>
                                <If condition={this.state.koreanitems.length > 2}>
                                    <Card3 style={styles.card} a={this.state.koreanitems[2]} b={this.state.koreanitemID[2]}/>
                                </If>
                                <If condition={this.state.koreanitems.length > 3}>
                                    <Card3 style={styles.card} a={this.state.koreanitems[3]} b={this.state.koreanitemID[3]}/>
                                </If>
                                <If condition={this.state.koreanitems.length > 4}>
                                    <Card3 style={styles.card} a={this.state.koreanitems[4]} b={this.state.koreanitemID[4]}/>
                                </If>
                                <If condition={this.state.koreanitems.length > 5}>
                                    <Card3 style={styles.card} a={this.state.koreanitems[5]} b={this.state.koreanitemID[5]}/>
                                </If>
                                <If condition={this.state.koreanitems.length > 6}>
                                    <Card3 style={styles.card} a={this.state.koreanitems[6]} b={this.state.koreanitemID[6]}/>
                                </If>
                            </CardList>
                            <CardList title={'Special Deals'}>
                            <If condition={this.state.specialdealitems.length > 0}>
                                    <Card4 style={styles.card} a={this.state.specialdealitems[0]} b={this.state.specialdealitemID[0]}/>
                                </If>
                                <If condition={this.state.specialdealitems.length > 1}>
                                    <Card4 style={styles.card} a={this.state.specialdealitems[1]} b={this.state.specialdealitemID[1]}/>
                                </If>
                                <If condition={this.state.specialdealitems.length > 2}>
                                    <Card4 style={styles.card} a={this.state.specialdealitems[2]} b={this.state.specialdealitemID[2]}/>
                                </If>
                                <If condition={this.state.specialdealitems.length > 3}>
                                    <Card4 style={styles.card} a={this.state.specialdealitems[3]} b={this.state.specialdealitemID[3]}/>
                                </If>
                                <If condition={this.state.specialdealitems.length > 4}>
                                    <Card4 style={styles.card} a={this.state.specialdealitems[4]} b={this.state.specialdealitemID[4]}/>
                                </If>
                                <If condition={this.state.specialdealitems.length > 5}>
                                    <Card4 style={styles.card} a={this.state.specialdealitems[5]} b={this.state.specialdealitemID[5]}/>
                                </If>
                                <If condition={this.state.specialdealitems.length > 6}>
                                    <Card4 style={styles.card} a={this.state.specialdealitems[6]} b={this.state.specialdealitemID[6]}/>
                                </If>
                            </CardList>
                        </View>
                    </ScrollView>
                <View style={styles.headerContainer}></View>

                     
                       
                  {/* <ScrollView onScroll={this.handleSwipe} style={styles.container}>
                    <Example3 {...itemProps}/>
                  </ScrollView>                    
                        </GestureRecognizer> */}
               </View>
               </Content>
               
               
               <View>
               <Footer style={{bottom: 0, position: 'absolute'}}>
                           <FooterTab>
                               
                               <Button active vertical>
            
               <Icon type="Entypo" name="home" 
               onPress= {() => this.props.navigation.navigate('MainTabScreen', {
                                user : currentUser, 
                                })
                        }/>
                               <Text>Home</Text>
                               </Button>

                               <Button vertical>
        
               <Icon type="FontAwesome" name="search" 
               onPress= {() => this.props.navigation.navigate('ProductSearchScreen') }/>
                               <Text>Search</Text>
                               
                               </Button>
                               
                               <Button vertical>
            
               <Icon type="Entypo" name="shopping-cart" 
               onPress= {() => this.props.navigation.navigate('JobHistoryScreen') }/>
                               <Text>Order History</Text>
                               </Button>
                               
                               <Button vertical>
         
               <Icon type="MaterialCommunityIcons" name="account"
               onPress= {() => this.props.navigation.navigate('MapScreen') }/>
                               <Text>My Account</Text>
               
               
                               </Button>
                           </FooterTab>
                       </Footer>
               
               </View>
               </Container>
               
               );
    }
}




// {/* <FlatList
//                         //    data={Username2}
//                         // data={this.state.image}

//                            renderItem={({item}) => 
//                            <Swipeable 
//                            onSwipe={this.handleSwipe}
//                            leftActionActivationDistance={100}
//                            leftContent={(
//                              <View style={[styles.leftSwipeItem, {backgroundColor: leftActionActivated ? 'lightgoldenrodyellow' : 'steelblue'}]}>
//                                {leftActionActivated ?
//                                  <Text>release!</Text> :
//                                  <Text>Swipe more to accept Job!</Text>}
//                              </View>
//                            )}
//                            onLeftActionActivate={() => this.setState({leftActionActivated: true})}
//                            onLeftActionDeactivate={() => this.setState({leftActionActivated: false})}
//                            onLeftActionComplete={() => this.setState({toggle: !toggle})}

//                            rightButtons={rightButtons}
//                            > 
//                                     <ListItem selected style={[styles.listItem, /*{backgroundColor: toggle ? 'thistle' : 'darkseagreen'}*/]}>
                                    
//                             //             <Left>
                                            
//                             //                 <TouchableHighlight>  
//                             //                 {/* <Text  style={{left: 20}}> */}
//                             //                     <View key={this.state.image} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }} >
//                             //                         <ActivityIndicator />
//                             //                     </View>
//                             //                     {/* {item.UserName} */}
//                             //                 {/* </Text> */}
//                             //                 </TouchableHighlight>
                                            
//                             //             </Left>
//                             //             <Right>
//                             //                 <Icon name="arrow-forward" />
//                             //             </Right>
                                        
//                             //         </ListItem>
//                             // </Swipeable>
//                         //    <ListItem
//                         //     title={`${this.state.items.UserName}`}
//                         //     //    this._renderuser.bind(Username)}
//                         //     />
//                             }
//                        /> */}