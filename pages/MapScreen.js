import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, TextInput,View, Alert, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, ScrollView, FlatList, ActivityIndicator, DatePickerIOS, NavigatorIOS, Constants, StatusBar, Dimensions, colors, Text, Keyboard, YellowBox} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MapView, {PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Badge} from 'native-base';
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


export default class MapScreen extends Component <Props> {
    static navigationOptions = {
    title: 'Map',
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
    
    constructor(props) {
        super(props);

        this.state = {
        error: "",
        latitude: 0,
        longitude: 0,
        destination: "",
        predictions: [],
        pickuppredictions: [],
        finalDestination: "",
        finalDes: "",
        finalDesLat: 0,
        finalDesLong: 0,
        pointCoords: [],
        PupointCoords: [],
        pickup: "",
        apiKey: "",
        getapiKey:"",
        responsekey: "",
        };
        this.onChangeDestinationDebounced = _.debounce(
                                                       this.onChangeDestination,
                                                       1500
                                                       );
        this.onChangepickupDebounced = _.debounce(
                                                       this.onChangepickup,
                                                       1500
                                                       );
    }
    
    
   
    
    componentDidMount() {
        const { region } = this.state;
        //Get current location and set initial region to this
        navigator.geolocation.getCurrentPosition(
                                                 position => {
                                                 this.setState({
                                                               latitude: position.coords.latitude,
                                                               longitude: position.coords.longitude
                                                               });
                                                 },
                                                 error => this.setState({ error: error.message }),
                                                 { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000}
                                                 );
        
//        this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
//                                                           var { distanceTotal, record } = this.state;
//                                                           this.setState({lastPosition});
//                                                           if(record) {
//                                                           var newLatLng = {latitude:lastPosition.coords.latitude, longitude: lastPosition.coords.longitude};
//
//                                                           this.setState({ track: this.state.track.concat([newLatLng]) });
//                                                           this.setState({ distanceTotal: (distanceTotal + this.calcDistance(newLatLng)) });
//                                                           this.setState({ prevLatLng: newLatLng });
//                                                           }
//                                                           },
//
//                                                           (error) => alert(JSON.stringify(error)),
//                                                           {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 5});
        
        
//        this.onSetdestination(finalDes);
        
        // convert the coordinates to the descriptive name of the place
//        Geocoder.from({
//                      latitude: position.coords.latitude,
//                      longitude: position.coords.longitude
//                      })
//        .then((response) => {
//              // the response object is the same as what's returned in the HTTP API: https://developers.google.com/maps/documentation/geocoding/intro
//
//              this.from_region = region; // for storing the region in case the user presses the "reset" button
//
//              // update the state to indicate the user's origin on the map (using a marker)
//              this.setState({
//                            start_location: {
//                            latitude: position.coords.latitude,
//                            longitude: position.coords.longitude
//                            },
//                            region: region, // the region displayed on the map
//                            from: response.results[0].formatted_address // the descriptive name of the place
//                            });
//
//              });
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
//        apiKey(async getapiKey =>  {
//            this.setState({ apiKey })
//                  const getApi = `http://localhost:3000/api/process/autocomplete`;
//                  const Keyresult = await fetch(getApi);
//                  const apiKey = await Keyresult._bodyText;
//
//            this.setState({
//                  apiKey: apiKey
//                                      });
//                  console.warn(apiKey)
//                        });
        return fetch(`http://localhost:3000/api/process/autocomplete`)
                     .then ((response) => response)
                     .then((responsekey) => {
                           this.setState({
                                         isLoading: false,
                                         responsekey: responsekey._bodyText,
                                         }, function() {
                                         // In this block you can do something with new state.
                                         });
                           this.setState({
                                         getapiKey: this.state.responsekey,
                                         }, function() {
                                         // In this block you can do something with new state.
                                         });
                           })
                     .catch((error) => {
                            console.error(error);
                            });
                     
    }
    

//    renderScreen = () => {
//        return (
//                <View style={styles4.container}>
//                <MapView
//                provider={PROVIDER_GOOGLE}
//                style={styles4.map}
//                initialRegion={this.state.initialPosition}/>
//                </View>
//                );
//    }
    async onChangepickup(pickup) {
        this.setState({ pickup })
        
        //        console.warn(destination);
        
        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE&input=${pickup}&location=${this.state.latitude}, ${this.state.longitude}&radius=2000`;
        const result = await fetch(apiUrl);
        const json = await result.json();
        this.setState({
                      pickuppredictions: json.predictions
                      });
//                console.warn(json.predictions);
        //        console.warn(json);
    }
    async onChangeDestination(destination) {
        this.setState({ destination })
        
//        console.warn(destination);
        
        

        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE&input=${destination}&location=${this.state.latitude}, ${this.state.longitude}&radius=2000`;
                                      
        const result = await fetch(apiUrl);
        const json = await result.json();
            this.setState({
                          predictions: json.predictions
            });
//        console.warn(json.predictions);
//        console.warn(json);
    }
    async pressedpickupPrediction(pickupprediction) {
        console.log(pickupprediction);
        Keyboard.dismiss();
        this.setState({
                      pickuppredictions: [],
                      pickup: pickupprediction.description
                      });
        Keyboard;
        
        const apiUrlPu = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${pickupprediction.place_id}&key=AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE`;
        
        const resultPu = await fetch(apiUrlPu);
        const jsonPu = await resultPu.json();
        
        //        console.warn(json2);
        
        const jsonPulat = jsonPu.results[0].geometry.location.lat;
        const jsonPulng = jsonPu.results[0].geometry.location.lng;
//        console.warn(jsonPulat, jsonPulng)
        
        this.setState({
                      latitude: jsonPulat,
                      longitude: jsonPulng,
                      });
        
//        const apiUrlDirPu = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${pickupprediction.place_id}&key=AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE`
//
//        const responsePu = await fetch(apiUrlDirPu);
//        const jsonDirPu = await responsePu.json();
//
//
//
//        const Pupoints = PolyLine.decode(jsonDirPu.routes[0].overview_polyline.points);
//
//        const PupointCoords = Pupoints.map(pupoint => {
//                                       return { latitude: pupoint[0], longitude: pupoint[1] };
//                                       });
////        console.warn(PupointCoords);
//        this.setState({
//                      PupointCoords: PupointCoords,
//                      routeResponse: jsonDirPu
//                      });
////        console.warn(PupointCoords);
//        this.map.fitToCoordinates(this.state.PupointCoords, {
//                                  edgePadding: { top: 20, bottom: 20, left: 20, right: 20 }
//                                  , animated: true});
        
        
    }
    async pressedPrediction(prediction) {
        console.log(prediction);
        Keyboard.dismiss();
        this.setState({
                      predictions: [],
                      destination: prediction.description
                      });
        Keyboard;
//        const finalDes = prediction.description;
//        this.setState({
//                      finalDes: prediction.place_id
//                      });
        const finalDes = prediction.place_id;
//        const apiUrl2 = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${prediction.place_id}&key=AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE`;
//
////        console.warn(apiUrl2);
////        console.warn(finalDes);
//
//        const result2 = await fetch(apiUrl2);
//        const json2 = await result2.json();
//
////        console.warn(json2);
//
//        const json2lat = json2.results[0].geometry.location.lat;
//        const json2lng = json2.results[0].geometry.location.lng;
//
//        this.setState({
//                      finalDestination: json2.latlng
//                      });
//
//        console.warn(this.state.latitude);
//        console.warn(this.state.longitude);
//        console.warn(json2lat);
//        console.warn(json2lng);
//
//        this.setState({
//                      finalDesLat: json2lat,
//                      finalDesLong: json2lng,
//        })
        
        const apiUrlDir = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${prediction.place_id}&key=AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE`
    
        const response = await fetch(apiUrlDir);
        const jsonDir = await response.json();
//        console.warn(jsonDir)
        const points = PolyLine.decode(jsonDir.routes[0].overview_polyline.points);
        const pointCoords = points.map(point => {
                                       return { latitude: point[0], longitude: point[1] };
                                       });
        
        this.setState({
                      pointCoords: pointCoords,
                      routeResponse: jsonDir
                      });
//        console.warn(this.state.pointCoords);
        this.map.fitToCoordinates(pointCoords, {
                                  edgePadding: { top: 20, bottom: 20, left: 20, right: 20 }
                                  , animated: true});
        
//        console.warn(this.state.pointCoords.length)
//        console.warn(json2.results[0].geometry);
//        onPress={() => this.onSetdestination(finalDes)};
    }
    
    
//        console.warn(this.state.finalDes);
//        onChangeText={finalDes =>
//            this.onSetdestination(finalDes)
//        }
    
    
//    async onSetdestination(finalDes) {
//        this.setState({ finalDes })
//
//    const apiUrl2 = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${finalDes}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyByafs124sPuBPPaERuDHuWG_oU40U-SHE`
//
//    const result2 = await fetch(apiUrl2);
//    const json2 = await result.json();
//        this.setState({
//                      finalDestination: json2.predictions
//                      });
//        console.warn(finalDestination)
//    }
    
    
    //        Geocoder.from(predictions)
    //        .then(json => {
    //              var location = json.results[0].geometry.location;
    //              console.warn(location);
    //              })
    //        .catch(error => console.warn(error));
    render() {
        let endMarker = null;
        let startMarker = null;
//        console.warn(this.state.getapiKey);
                     
        // console.warn(this.state.user);
        
        const predictions = this.state.predictions.map(
        prediction => (
        <TouchableHighlight
        key={prediction.place_id}
        onPress={() => this.pressedPrediction(prediction)}
        >
              <Text style={styles.locationSuggestions}
                       key={prediction.place_id}
                       
                       >
          
            
                       {prediction.description}
                </Text>
                       
        
          </TouchableHighlight>
                       
             )
            );
        const pickuppredictions = this.state.pickuppredictions.map(
        pickupprediction => (
        <TouchableHighlight
        key={pickupprediction.place_id}
        onPress={() => this.pressedpickupPrediction(pickupprediction)}
        >
        <Text style={styles.locationSuggestions}
        key={pickupprediction.place_id}
                                                                      
        >
                                                                      
                                                                      
        {pickupprediction.description}
        </Text>
                                                                      
                                                                      
        </TouchableHighlight>
                                                                      
        )
        );
       
        if (this.state.pointCoords.length > 1) {
            endMarker = (
                         <Marker
                         coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
                         >

                         </Marker>
                         );
        };
        
        
        return(

               <Container>
               
               
               <View>
               <MapView
               provider={PROVIDER_GOOGLE}
               style={styles.map}
               
               region={{
               latitude: this.state.latitude,
               longitude: this.state.longitude,
               latitudeDelta: 0.015,
               longitudeDelta: 0.0121
               }}
               zoomEnabled={true}
               zoomControlEnabled={true}
               
               showsUserLocation={true}
               >
               
               <Polyline
               coordinates={this.state.pointCoords}
               strokeWidth={4}
               strokeColor="brown"
               />
               {endMarker}
               {startMarker}

               
               <MapView.Marker
               coordinate={{latitude: this.state.finalDesLat,
               longitude: this.state.finalDesLong}}
               title={"Test Location"}
               description={"Test Location"}
               />
               
               <MapView.Marker
               coordinate={{latitude: -33.919570,
               longitude: 151.076830}}
               title={"Home"}
               description={"Home Location"}
               />
               
               <View>
                       <TextInput
                       placeholder="Enter pick up location..."
                       style={styles.pickupInput}
                       value={this.state.pickup}
                       onChangeText={pickup =>
                       this.onChangepickupDebounced(pickup)
                       }
               
                       />
               
                       <TextInput
                       placeholder="Enter destination..."
                       style={styles.destinationInput}
                       value={this.state.destination}
                       onChangeText={destination =>
                       this.onChangeDestinationDebounced(destination)
                       }
               
                       />
               
                                {pickuppredictions}
                                {predictions}
               
               
               </View>
               
               
               
               
               
               </MapView>
               
               </View>
               
                   <Content />
               <View>
               <Footer style={{bottom: 0, position: 'absolute'}}>
                           <FooterTab>
                               <Button vertical>
               <Icon type="MaterialCommunityIcons" name="package" 
               onPress= {() => this.props.navigation.navigate('MainTab') } />
                               <Text>Job Offer</Text>
                               </Button>

                               <Button badge vertical>
                                <Badge><Text>2</Text></Badge>
               <Icon type="MaterialCommunityIcons" name="package-variant-closed" 
               onPress= {() => this.props.navigation.navigate('JobDetailsScreen') }/>
                               <Text>Job Details</Text>
                               </Button>

                               <Button vertical>
               <Icon type="MaterialCommunityIcons" name="package-variant" 
               onPress= {() => this.props.navigation.navigate('JobHistoryScreen') }/>
                               <Text>Job History</Text>
                               </Button>
                               
                               <Button active vertical>
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
