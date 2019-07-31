import React from 'react'
import { Platform, View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native'
import { withNavigation } from 'react-navigation'
import Tag from './Tag'
// import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'react-native-firebase';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Badge, ListItem, Left, Right, Body, List, Title, Card, CardItem, Segment, Tabs, Tab, TabHeading} from 'native-base';

// import {Fonts, Ionicons, Icons} from 'react-native-vector-icons';


class InfoScreen extends React.Component {
  constructor(props) {
    super(props)
    this.heartSize = new Animated.Value(1);
    this.state = {
      liked: false,
    
    user: "",
    JobData: "",
    Jobs: [],
    items: [],
    itemsID: [],
    items_array: [],
    Provider:"",
    itemID: [],
    itemID_array: [],
    Jobdetails: "",
    ProductID: [],
    productname: "",
    productprice: "",
    Username: [],
    currentUser: "",
    leftActionActivated: false,
    toggle: false,
    currentlyOpenSwipeable: null,
    loading: true,
    mounted: true,
    image: "/Products/image2.jpg",
    url: "",
    info: "",
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
                                       
                                       } else {
                                       // No user is signed in.
                                       that.props.navigation.navigate('Home');
                                       }
                                       });

   this.setState({ isMounted: true });

   this.getProduct();

   this.didFocusListener = this.props.navigation.addListener(
    'didFocus',
    () => { console.log('did focus') },
  );
   
}

componentWillUnmount() {
    this.setState({ isMounted: false });
    this.didFocusListener.remove();
    // console.warn(12);
}

componentWillReceiveProps(props) {
    this.props = props
    if (this.props.refresh == true) {

    }
}

  like() {
    this.setState({ liked: true })
    Animated.spring(this.heartSize, {
      toValue: 1.1,
      friction: 1
    }).start()
  }

  unlike() {
    this.setState({ liked: false })
    this.heartSize.setValue(1)
  }

  async getProduct()
  { var that = this;
    // var i = 0;
    // var photoID = 0;
    
    if (this.state.mounted == true) {
    // var i = 0;
    // var photoID = 0;


    const db = firebase.firestore();
          db.settings({ timestampsInSnapshots: true});
                  const query = db.collection('Products').where('productID', '==', this.props.navigation.state.params.productID);
                  const snapshot = await query.get();

                  const items = snapshot.docs.map(
                    doc => doc.data(),
                    // photoID = i + 1, 
                  );
                  
                  // photoID = i + 1;

                  const itemsID = snapshot.docs.map(doc => doc.id);
                  var itemsID = snapshot.docs.map(
                    doc => doc.id,
                    
                    );

                    this.setState({ items: items,
                                    itemsID: itemsID
                    });
                    // console.warn(this.props.a);
                    // console.warn(this.props.b);
                    // console.warn(this.state.items[0].info);

                  this.setState({ productname: this.props.navigation.state.params.items.productname,
                    productprice: this.props.navigation.state.params.items.price,
                    currency: this.props.navigation.state.params.items.currency,
                    category: this.props.navigation.state.params.items.productcategory,
                    pricelevel: this.props.navigation.state.params.items.pricelevel,
                    itemID: this.props.navigation.state.params.productID,
                    comments: this.props.navigation.state.params.items.comments,
                    info: this.props.navigation.state.params.items.info
                  });
                  
                  
                    // }  
            }
  };

    getProductdetails()
    {
      // if (this.state.mounted == true) {
      var i = 0;
      var photoID = 0;
      var storage = firebase.storage();
                    for (var i = 0; i <= this.state.itemsID.length - 1; i++) {
                      // photoId = i + 1;
                      // console.warn(itemsID[i]);
                      
                      this.setState({ productname: this.state.items[i].productname 
                      });
                      // console.warn(this.state.itemsID);

                      refPath = storage.ref(this.state.itemsID[i]);
                      
                      // (function(pid) {
                          refPath.getDownloadURL().then(data => {
                                this.setState({ url: data}),
                                this.setState({ loading: false });
                  //               this.setState({ productname: items[i].productname ,
                  //                 productprice: items[i].price
                  // });
                                // console.warn(this.state.url);
                      // console.warn(this.state.productname);
                      //           console.warn(this.state.url);
                                // this.setState({ Product: items[i] });
                                // console.warn(data);
                            }).catch(function(error) {
                              console.warn(error);
                          })
                      // });
                      
                      // console.warn(this.state.productprice);
                      // console.warn(this.state.productname);
                      //           console.warn(this.state.url);
                    // console.warn(photoID);
                    // console.warn(i);
                  }
                // }
    };

  render() {
    if (this.state.itemsID.length == 0) {
      return null
    } else {
    // console.warn(this.state.itemsID);
    // this.getProductdetails();
    }
    // console.warn(this.state.itemsID.length);
    // console.warn(this.state.url.length);
    // this.getProductdetails(this.state.itemsID);

    if (this.state.items.length == 0) {
      return null
    }
    else {
      // console.warn(this.state.url);
      // console.warn(this.state.productname);
    return (
      <View style={this.props.style}>
      <View style={{marginLeft: -10, marginRight: -10, marginTop: -13}}>
              <Content padder>
                <Card>
                  <CardItem bordered>
                    <Body>
                      <Text>
                        {this.state.items[0].info}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </Content>


        </View>
  </View>
    )
    }
  }
}

export default withNavigation(InfoScreen)

const styles = StyleSheet.create({
  container: {
    width: 320,
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5
  },
  image: {
    height: 150
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: 16,
    marginTop: 10
  },
  description: {
    color: '#999',
    marginTop: 5
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    bottom: 15
  }
})
