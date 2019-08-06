// import React from 'react';
import React, { Component } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Image, Animated, StatusBar, TouchableHighlight, ScrollView } from 'react-native'
import { createBottomTabNavigator, createAppContainer, withNavigationFocus } from 'react-navigation'
import Tag from './Tag';
import Tab1 from './Review2';
import Tab2 from './Info2';
// import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'react-native-firebase';
import Modal from "react-native-modal";
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Badge, ListItem, Left, Right, Body, List, Title, Card, CardItem, Segment, Tabs, Tab, TabHeading} from 'native-base';

// import {Fonts, Ionicons, Icons} from 'react-native-vector-icons';

import Card1 from '../components/Cardsimilar'
import CardList from '../components/CardList'



export default class MenuScreen2 extends Component <Props> {
  static navigationOptions = {
    title: 'MenuScreen2',
    };
  constructor(props) {
    super(props);
    console.log("MenuScreen constructor start");
  this.didFocusListener = this.props.navigation.addListener(
		'didFocus',
		(obj) => {console.log("MenuScreen didFocus start")}
	);
	this.didBlurListener = this.props.navigation.addListener(
		'didBlur',
		(obj) => {console.log('MenuScreen didBlur start')}
	);
    this.heartSize = new Animated.Value(1);
    this.state = {
      liked: false,
    
    user: "",
    userID: "",
    JobData: "",
    Jobs: [],
    items2: [],
    itemsID2: [],
    items_array: [],
    Provider:"",
    itemID2: [],
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
    currency: "",
    category: "",
    pricelevel: "",
    isModalVisible: false,
    comments: "",
    activePage:1,
    };

    
}

  componentDidMount() {
    var that = this;
    
    firebase.auth().onAuthStateChanged(function(user) {
                                       if (user) {
                                        // const userID = user.uid;

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

   this.getmyfavProduct();

  //  console.warn(Math.random());

   this.getProduct();
  //  console.warn(this.state.itemID, this.state.productname);
      // console.warn(this.props.navigation.state.params);

      this.didFocusListener = this.props.navigation.addListener(
        'didFocus',
        () => { console.log('did focus') },
      );
   
}

componentWillUnmount() {
    this.setState({ isMounted: false });
    console.log('unmount');
    this.didFocusListener.remove();
}

componentWillReceiveProps(props) {
    this.props = props
    if (this.props.refresh == true) {
      // console.warn('receiveprops');
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

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });

    // console.warn(this.state.isModalVisible);
  };

  selectComponent = (activePage) => () => this.setState({activePage});

  _renderComponent = () => {
    // console.warn(this.state.activePage);
    if(this.state.activePage === 1)
      return <Tab1 a={this.props.navigation.state.params.items} b={this.props.navigation.state.params.productID}/> //... Your Component 1 to display
    else 
      return <Tab2 a={this.props.navigation.state.params.items} b={this.props.navigation.state.params.productID}/> //... Your Component 2 to display
  };

  async getProduct()
    { var that = this;
      // var i = 0;
      // var photoID = 0;
      
      if (this.state.mounted == true) {
      // var i = 0;
      // var photoID = 0;


      const db = firebase.firestore();
            db.settings({ timestampsInSnapshots: true});
                    const query = db.collection('Productcomments').where('productID', '==', this.props.navigation.state.params.productID);
                    const snapshot = await query.get();

                    const items2 = snapshot.docs.map(
                      doc => doc.data(),
                      // photoID = i + 1, 
                    );
                    
                    // photoID = i + 1;

                    const itemsID2 = snapshot.docs.map(doc => doc.id);
                    var itemsID2 = snapshot.docs.map(
                      doc => doc.id,
                      
                      );

                      this.setState({ items2: items2,
                                      itemsID2: itemsID2
                      });
                      // console.warn(this.props.navigation.state.params.items);
                      // console.warn(this.props.navigation.state.params.productID);

                    this.setState({ productname: this.props.navigation.state.params.items.productname,
                      productprice: this.props.navigation.state.params.items.price,
                      currency: this.props.navigation.state.params.items.currency,
                      category: this.props.navigation.state.params.items.productcategory,
                      pricelevel: this.props.navigation.state.params.items.pricelevel,
                      itemID: this.props.navigation.state.params.productID,
                      comments: this.props.navigation.state.params.items.comments,
                    });
                    
                    // console.warn(this.props.b);
                    var storage = firebase.storage();
                    // for (var i = 0; i <= itemsID.length - 1; i++) {

                      refPath = storage.ref(this.props.navigation.state.params.items.imagepath);
                      // console.warn(refPath);
                          refPath.getDownloadURL().then(data => {
                                this.setState({ url: data}),
                                this.setState({ loading: false });
                            }).catch(function(error) {
                              console.warn(error);
                          })
                      // }  
              }
    };

    async getmyfavProduct()
    { 
      if (this.state.mounted == true) {
      const db = firebase.firestore();
            db.settings({ timestampsInSnapshots: true});
                    const query = db.collection('Products').where('available', '==', 'Y').where('productcategory', '==',this.props.navigation.state.params.items.productcategory).limit(10);
                    const snapshot = await query.get();

                    const items2 = snapshot.docs.map(
                      doc => doc.data(),
                      // photoID = i + 1, 
                    );
                    // console.warn(this.props.navigation.dangerouslyGetParent().state.key);
                    // console.warn(this.props.navigation.state);
                    // photoID = i + 1;
                        // console.warn('MenuScreen' + Math.round(Math.random()*100));
                    // const itemsID = snapshot.docs.map(doc => doc.id);
                    var itemsID2 = snapshot.docs.map(
                      doc => doc.data().imagepath,
                      
                      );

                      const itemID2 = snapshot.docs.map(
                        doc => doc.id,
                        // photoID = i + 1, 
                      );

                      this.setState({ myfavitems: items2,
                                      myfavitemsID: itemsID2,
                                      myfavitemID: itemID2
                      });
                  //  console.warn(this.state.myfavitems.length);
                  //  console.warn(this.state.myfavitemID.length);
                  }
    };
    
addtocart()
{
  const currentUser = firebase.auth().currentUser;

  let FieldValue = firebase.firestore.FieldValue;

  let ActiveCart = {
    userID: currentUser.uid,
    product: {
        productID: this.state.itemID, 
        productname: this.state.productname, 
        productprice: this.state.productprice, 
        productcurrency: this.state.currency, 
        productquantity: 1},
    // productID: this.state.itemID,
    // productname: this.state.productname,
    // price: this.state.productprice,
    // quantity: 1,
    timestamp: FieldValue.serverTimestamp(),
  };

  const db = firebase.firestore();
  db.settings({ timestampsInSnapshots: true});
          const query = db.collection('ActiveCart').doc(currentUser.uid);
          const snapshot = query.get()
          .then(doc => {
            if (!doc.exists) {
              console.warn('No such document!', currentUser.uid);
              let setDoc = db.collection('ActiveCart').doc(currentUser.uid).set(ActiveCart, {merge: true});
            } else {
              // console.warn('Document data:', doc.data().product[0]);

              const product = ActiveCart.product

              // const product[5] = [ActiveCart.product[0]+","+ActiveCart.product[1]]

              // console.warn(product.productID);
              // console.warn(doc.data().product.productID);

              if(product.productID.includes(doc.data().product.productID) == true){
                ActiveCart.product.productquantity = ActiveCart.product.productquantity + 1

                let ActiveCartFinal = {
                  userID: ActiveCart.userID,
                  product: ActiveCart.product,
                  // productID: this.state.itemID,
                  // productname: this.state.productname,
                  // price: this.state.productprice,
                  // quantity: ActiveCart.quantity + 1,
                  timestamp: FieldValue.serverTimestamp(),
                };
                let setDoc = db.collection('ActiveCart').doc(currentUser.uid).set(ActiveCart, {merge: true});

                // console.warn(product);
                // console.warn(productfinal);
                // console.warn(product.includes(doc.data().product[0]));
                console.warn(ActiveCartFinal);

              } else {
                

              }

              
              // let setDoc = db.collection('ActiveCart').doc(currentUser.uid).set(ActiveCart, {merge: true});
            }
          })
          .catch(err => {
            console.warn('Error getting document', err);
          });
        


  // console.warn(items, this.state.itemID, this.state.productname, this.state.productprice);
  
  // Add a new document in collection "cities" with ID 'LA'
  
  


};


  render() {
    const currentUser = firebase.auth().currentUser;

    if (this.state.url.length == 0) {
      return null
    }
    else {

    // console.warn(currentUser);
      // console.warn(this.state.url);
      // console.warn(this.state.productname);
    return (
      <Container >
               <Header>
                   <Left style={{left: 20}}>
                      <TouchableHighlight
                       onPress={() => this.props.navigation.navigate('MainTabScreen')}
                       >
                          <View style={{padding: 5, borderColor: 'black', borderRadius: 5,}}>
                            <Text >
                                TBD
                            </Text>
                            </View>
                       </TouchableHighlight>
                   </Left>
                   <Body>
                        <Title style={{ fontSize: 15 }}>Product Details</Title>
                   </Body>
                   <Right style={{right: 20}}>
                        <Button hasText transparent
                        onPress={() => this.getcart()}
                        >
                            <Icon type="Entypo" name="shopping-cart" style={{ fontSize: 15 }}>
                        
                            </Icon>    
                        </Button>
                   </Right>
               </Header>
            <Content >
            <View >
              <TouchableOpacity activeOpacity={0.7}>
              {/* <Modal isVisible={this.state.isModalVisible}> */}
                <View style={styles.container}>
                  <View>
                    <Image style={styles.image} source={{ uri: this.state.url }} />
                    {/* <TouchableOpacity
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      activeOpacity={0.7}
                      onPress={() => this.state.liked ? this.unlike() : this.like()}
                      style={styles.iconContainer}
                    > */}
                      {/* <Animated.View style={{ transform: [{ scale: this.heartSize }] }}>
                        <Ionicons
                          name={(Platform.OS === 'ios' ? 'ios-heart' : 'md-heart') + (this.state.liked ? '' : '-empty')}
                          size={32}
                          color="#fff"
                        />
                      </Animated.View> */}
                    {/* </TouchableOpacity> */}
                  </View>
                  <Text style={styles.title}>{this.state.productname}</Text>
                  <Text style={styles.description}>{this.state.pricelevel} . {this.state.category}</Text>
                  <View style={styles.tagContainer}>
                    <Tag>25-35 min</Tag>
                    <Tag>4.6 (500+)</Tag>
                    <Tag>Price: {this.state.currency} {this.state.productprice}</Tag>
                  </View>
                </View>
                {/* </Modal> */}
              </TouchableOpacity>
            

            <Container style={styles.tabcontainer}>
            {/* <Body > */}
              <Segment style={{Left: 0, Right: 0}}>
                <Button active={this.state.activePage === 1} style={{Left: 0, width: 175, justifyContent: 'center',}}
                    onPress={this.selectComponent(1)}><Text>Review</Text></Button>
                <Button  active={this.state.activePage === 2} style={{Right: 0, width: 175, justifyContent: 'center',}}
                    onPress= {this.selectComponent(2)}><Text>Info</Text></Button>
              </Segment>
              {/* </Body> */}
            <Content padder style={{marginTop: -20}}>
              {this._renderComponent()}
            </Content>
            </Container>
            
            <Container style={{marginTop: -650, marginBottom: -400}}>
            <View style={styles.scrollcontainer}>
                    <ScrollView style={styles.scrollViewContainer}>
                        <View style={{ paddingTop: 5, color: '#eee', }}>
                            <CardList title={'Similar Menu'} style={{color: '#eee',}}>
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
                            </View>
                    </ScrollView>
            </View>
            </Container>
            

            </View>
            </Content>

            <View>
               <Footer style={{bottom: 0, position: 'absolute'}}>
                           <FooterTab>
                               
                               <Button Active vertical>
            
               <Icon type="Entypo" name="home" 
               onPress= {() => this.props.navigation.navigate('MainTab', {
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

      
    )
    }
  }
}


// export default withNavigation(Card)

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#eee',
    marginTop: StatusBar.currentHeight,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
    paddingTop: 15
  },
  scrollcontainer: {
    flex: 1,
    backgroundColor: '#eee',
    // marginTop: StatusBar.currentHeight,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
    paddingTop: 15
  },
  card: {
    marginRight: 10,
    // backgroundColor: '#eee',
  },
  tabcontainer: {
    flex: 1,
    backgroundColor: '#eee',
    // marginTop: StatusBar.currentHeight,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    paddingTop: 15
  },
  image: {
    height: 200,
    // width: 350,
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8
  },
  title: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 10
  },
  description: {
    color: '#999',
    marginTop: 5,
    marginLeft: 10
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    bottom: 15,
    marginLeft: 10
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#eee',
    marginTop: 0,
  },
})
