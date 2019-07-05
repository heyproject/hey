import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, TextInput,View, Alert, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, ScrollView, FlatList, ActivityIndicator, DatePickerIOS, NavigatorIOS, Constants, StatusBar, Dimensions, colors, Text, Keyboard, YellowBox} from 'react-native';
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
import firebase from 'react-native-firebase';




const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

//Geocoder.init('AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE'); // initialize the geocoder



const {
    RNSpeechToText
} = NativeModules

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
                                 });


const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

//function getJobarray(Job){
//    let li = Job.createElement('li');
//    let assignedto = Job.createElement('span');
//
//    li.setAttribute('data-id', doc.id);
//    assignedto.textCOntext = doc.data().assignedto;
//
//    li.appendChild(assignedto);
//
//    db.appendChild(li);
//};

//function getJobarray(Job){
//
//};

export default class JobDetailsScreen extends Component <Props> {
    static navigationOptions = {
    title: 'JobDetailsScreen',
    };
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
        this.timeout = 20;
        this.state = {
        user: "",
        JobData: "",
        Jobs: [],
        items: [],
        items_array: [],
        Provider:"",
        itemID: [],
        itemID_array: [],
        Jobdetails: "",
        JobID: [],
        Job: [],
        Username: []
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
                                                                          });
                                                                          
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
       this.getJob();
       
    }
    // componentWillMount() {
    //     // It's best to use your api call on componentWillMount
    //     this.getJob();
        
        
    // }
    
//    if (Object.keys(this.state.user).length == 0) {
    //        console.log(Object(this.state.user));} else {
//        getJob()
//    { /* Remove arrow function */
//
//        const db = firebase.firestore();
//        db.settings({ timestampsInSnapshots: true});
////        var query = db.collection('Jobs').where('completed', '==', 'N').limit(5);
////        var observer = query.onSnapshot(querySnapshot => {
//
//        db.collection('Jobs').where('completed', '==', 'N').limit(5).get().then((Snapshot) => {
////
//                                         Snapshot.docs.forEach(doc =>
//                                                               {
//                                                               let items = doc.data();
//
//                                                               /* Make data suitable for rendering */
//                                                               items = JSON.stringify(items);
//
//                                                               /* Update the components state with query result */
//                                                               this.setState({ items : items })
//                                                               });
//
//                                         })
//                                                .catch(err => {
//                                                       console.log('Error getting documents', err);
//                                                       });
    
        async getJob()
        { /* Remove arrow function */
            // console.warn(this.state.user_uid);
            const currentUser = firebase.auth().currentUser.uid;
     
            console.warn(currentUser);
            
            // db.settings({ timestampsInSnapshots: true});
            // const userProviderquery = user.providerData[0].providerId;
            // const userquery = db.collection('users').where("provider."+userProviderquery, "==", user.uid).get();
            // const usersnapshot = await userquery.get();
            // const users = snapshot.docs.map(doc => doc.data(),
            //         console.warn(this.state.user_uid),
            //         );

            // if (Object.keys(items).length > 0 ){
            // return this.setState({items: items})
            // console.warn(this.state.items)};

            const db = firebase.firestore();
            const query = db.collection('Jobs').where('assignedto', '==', currentUser).where('completed', '==', 'N').limit(5);
            const snapshot = await query.get();
            const items = snapshot.docs.map(doc => doc.data(),
                    // console.warn(currentUser),
                    );
                    
            if (Object.keys(items).length > 0 ){
            return this.setState({items: items})
            console.warn(this.state.items)};

                    
                };

//                    
    render() {
        // const data = this.props.items || [];
        
        const itemID = this.state.itemID[0];
        const JobID = itemID;
        const Username = JSON.stringify(this.state.items.UserName);

        let Username2 = this.state.items;

        // console.warn(items);
// console.warn(this.state.items);
// console.warn(this.state.user_uid);



        // console.warn(Username);

        return(
               (<p>{ this.state.items || 'Loading' }</p>),
            //    console.warn(itemID),
            //    console.warn(Username),
            // console.warn(Username2),
               <Container>
               <Header>
                   <Left style={{left: 20}}>
                       <TouchableHighlight
                       onPress={() => this.getJob()}
                       >
                        <Text >
                            Update
                        </Text>
                       </TouchableHighlight>
                   </Left>
                   <Body>
                        <Title>Job Offer</Title>
                   </Body>
                   <Right style={{right: 20}}>
                        <Button hasText transparent>
                        <Text>All Jobs Start</Text>
                        </Button>
                   </Right>
               </Header>
             
               <Content>
               <View>
                       <FlatList
                        //    data={[{ name: "bob" }, { name: "tim" }]} 
                           data={Username2}
                        //    keyExtractor={ Username2 => Username2}
//                           ListFooterComponent={() =>
//                           this.state.loading
//                           ? null
//                           : <ActivityIndicator size="large" animating />}
                           renderItem={({item}) => 
                                    <ListItem selected>
                                    <Left>
                                    <Text>
                                        {item.UserName}
                                    </Text>
                                    </Left>
                                    <Right>
                                            <Icon name="arrow-forward" />
                                        </Right>
                                    </ListItem>
                        //    <ListItem
                        //     title={`${this.state.items.UserName}`}
                        //     //    this._renderuser.bind(Username)}
                        //     />
                            }
                       />
               
               </View>
               </Content>
               
               
               <View>
               <Footer style={{bottom: 0, position: 'absolute'}}>
                           <FooterTab>
                               
                           <Button badge vertical>
            
               <Icon type="MaterialCommunityIcons" name="package" 
               onPress= {() => this.props.navigation.navigate('MainTab') }/>
                               <Text>Job Offer</Text>
                               </Button>

                               <Button active vertical>
        
                               {/* <Badge><Text>2</Text></Badge> */}
               <Icon type="MaterialCommunityIcons" name="package-variant-closed" 
               onPress= {() => this.props.navigation.navigate('JobDetailsScreen') }/>
                               <Text>Job Details</Text>
                               
                               </Button>
                               
                               <Button vertical>
            
               <Icon type="MaterialCommunityIcons" name="package-variant" 
               onPress= {() => this.props.navigation.navigate('JobHistoryScreen') }/>
                               <Text>Job History</Text>
                               </Button>
                               
                               <Button vertical>
         
               <Icon type="MaterialCommunityIcons" name="account"
               onPress= {() => this.props.navigation.navigate('MapScreen') }/>
                               <Text>Map</Text>
               
               
                               </Button>
                           </FooterTab>
                       </Footer>
               
               </View>
               </Container>
               
               );
    }
}

//
//<Polyline
//coordinates={this.state.pointCoords}
//strokeWidth={4}
//strokeColor="red"
///>
//{endMarker}
//{startMarker}

//async onSetdestination(finalDes) {
//    this.setState({ finalDes })
//
//    const result2 = await fetch(apiUrl2);
//    const json2 = await result2.json();
//    this.setState({
//                  finalDestination: json.predictions
//                  });
//    }

// var observer = query.onSnapshot( async querySnapshot => {
    //                     // var observer = query.snapshot( async snapshot => {   
    //                                                     querySnapshot.forEach(async doc => {
    //                                                     // snapshot.forEach(async doc => {
    //                                                                         //   const Jobdetails = doc.data();
    //                                                                         //   const JobID = doc.id;
    //                                                                         //   const Job = {JobID, Jobdetails};
    //                                                         this.setState({  Jobdetails: doc.data(),
    //                                                                             JobID : doc.id,
    //                                                                             // Job : {JobID, Jobdetails},
    //                                                                             });
    //                                                         // console.warn(`Received doc snapshot: ${querySnapshot}`);
                                                                              
    // //                                                                          const Jobdocs = doc._documen.data();
    // //                                                                          getJobarray(Job);
    // //                                                                          console.warn(Job);
    // //                                                                          console.warn(this.state.user_uid);
    // //                                                    let items = `${querySnapshot}`;
    // //                                                         console.warn(Job);
    //                                                     items = JSON.stringify(this.state.Job);
                                                                              
    // //                                                    this.setState({ items : [this.state.items, ','
    // //                                                                             ],
    // //                                                                             });
                                                        
    // //                                                     console.warn(items);
                                                                              
    //                                                 //    console.warn(this.state.Jobdetails);
    //                                                 //    console.warn(JobID);
    //                                                 //     // ...
    //                                                     this.setState({ items : [this.state.Jobdetails]
    //                                                                             ,
    //                                                                     Username : this.state.Jobdetails.UserName 
    //                                                                             });
    //                                                                         //  console.warn(this.state.items);
    // //                                                     if (this.state.items.length > 0 ){
    // //                                                         if(this.state.items == Job){
    // //                                                             // console.warn(this.state.itemID);
    // //                                                         } else {
    // // //
    // //                                                     this.setState({ items_array : [this.state.items,  Job
    // //                                                                             ],
    // //                                                                             });
    // //                                                      const array = this.state.items_array                     
    // //                                                             // console.warn(array);
    // //                                                                         }
    // //                                                                           };
    //                                                 this.setState({ itemID : [this.state.JobID
    //                                                                             ],
    //                                                                           });
    //                                                                     //    console.warn(this.state.itemID);
    // //                                                   if (this.state.itemID.length > 0 ){
    // //                                                     if(this.state.itemID == JobID){
    // //                                                         // console.warn(this.state.itemID);
    // //                                                     } else {
    // // //
    // //                                                     this.setState({ itemID_array : [this.state.itemID,  JobID
    // //                                                                             ],
    // //                                                                             });
    // //                                                     const itemID_array = this.state.itemID_array                     
    // //                                                             //   console.warn(itemID_array);
    // //                                                     }
    // //                                                         };
    //                                                         // console.warn(itemID_array);
    //                                                                           }
    //                                                                           );
    //                                                     }
    //                                                                           , err => {
    //                                                     console.warn(`Encountered error: ${err}`);
    //                                                     });
        
        
        // _renderuser(Username){
        //     if (Object.keys(Username).length > 0 ){
        //       console.warn(Username);   
        //             <View>
        //                 <Text>
        //                     {Username}
        //                 </Text>
        //             </View>
        //     }
                                                                        // };
        
    //    }

    //        const Jobs = this.state.items(
//        Job => (
//                       <TouchableHighlight
//                       key={this.state.items.JobID}
////                       onPress={() => this.pressedPrediction(prediction)}
//                       >
//                       <Text
//                       key={this.state.items.JobID}
//
//                       >
//
//
//                       {this.state.items.JobID}
//                       </Text>
//
//
//                       </TouchableHighlight>
//
//                       )
//        );
//
//        if (Object.keys(this.state.user).length == 0) {
//            console.warn(1);
//            console.log(Object(this.state.user));} else
//            console.warn(Object(this.state.user));
//        {const JobData = firebase.firestore().collection('Jobs').where('completed', '==', 'N').get();
//            var that = this;
//            const results = JobData.then(
//                         snapshot => {
//                         if (snapshot.empty) {
//                         console.log('No matching documents.');
//                         return;
//                         }
//                         snapshot.forEach(doc => {
//                                          console.log(doc.id, '=>', doc.data());
//                                          this.setstate({
//                                                        jobsid: doc.id,
//                                                        jobs: doc.data(),
//                                                        loaded: true,
//                                                        });
////                                          console.warn(that.state.jobsid);
//                                          });
//                         })
//                        .catch(err => {
//                           console.log('Error getting documents', err);
//                           });
//
////            console.warn(this.state.jobsid);
////            const JobData = firebase.firestore().collection('jobs').get();
//        }
        
        
//        console.warn(this.state.user_uid);
//        console.warn(this.state.items[0]);
        
//        console.warn(Object.keys(this.state.user).length);