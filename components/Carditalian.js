import React from 'react'
import { Platform, View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native'
import { withNavigation } from 'react-navigation'
import Tag from './Tag'
// import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'react-native-firebase';
import Modal from "react-native-modal";
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Badge, ListItem, Left, Right, Body, List, Title} from 'native-base';

// import {Fonts, Ionicons, Icons} from 'react-native-vector-icons';


class Card extends React.Component {
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
    currency: "",
    category: "",
    pricelevel: "",
    isModalVisible: false,
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

   
}

componentWillUnmount() {
    this.setState({ isMounted: false })
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

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });

    // console.warn(this.state.isModalVisible);
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
                    const query = db.collection('Products').where('available', '==', 'Y').limit(10);
                    const snapshot = await query.get();

                    const items = snapshot.docs.map(
                      doc => doc.data(),
                      // photoID = i + 1, 
                    );
                    
                    // photoID = i + 1;

                    // const itemsID = snapshot.docs.map(doc => doc.id);
                    var itemsID = snapshot.docs.map(
                      doc => doc.data().imagepath,
                      
                      );

                      this.setState({ items: items,
                                      itemsID: itemsID
                      });
                      // console.warn(this.props.a);

                    this.setState({ productname: this.props.a.productname,
                      productprice: this.props.a.price,
                      currency: this.props.a.currency,
                      category: this.props.a.productcategory,
                      pricelevel: this.props.a.pricelevel,
                      itemID: this.props.b
                    });
                    
                    // console.warn(this.props.b);
                    var storage = firebase.storage();
                    // for (var i = 0; i <= itemsID.length - 1; i++) {

                      refPath = storage.ref(this.props.a.imagepath);
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


  render() {
    const currentUser = firebase.auth().currentUser;

    if (this.state.url.length == 0) {
      return null
    }
    else {
      // console.warn(this.state.url);
      // console.warn(this.state.productname);
    return (
      <View style={this.props.style}>
      <TouchableOpacity activeOpacity={0.7} /*onPress={this.toggleModal} */ 
                    onPress= {() => this.props.navigation.navigate({routeName: 'MenuScreen', 
                    params: { 
                      user : currentUser,
                      items : this.props.a,
                      productID : this.state.itemID, 
                      productname : this.state.productname, 
                      productprice : this.state.productprice, 
                      productcurrency : this.state.currency
                      },
                      key: 'MenuScreen' + Math.round(Math.random()*100)})}>
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

      <View>
        <Modal isVisible={this.state.isModalVisible} hasBackdrop={true} coverScreen={true} style={styles.modalcontainer}>
          {/* <View style={{marginTop:100}}> */}
            <View>
              <Image style={styles.modalimage} source={{ uri: this.state.url }} />
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
            <Text style={styles.modaltitle}>{this.state.productname}</Text>
            <Text style={styles.modaldescription}>{this.state.pricelevel} . {this.state.category}</Text>
            <View style={styles.modaltagContainer}>
              <Tag>25-35 min</Tag>
              <Tag>4.6 (500+)</Tag>
              <Tag>Price: {this.state.currency} {this.state.productprice}</Tag>
            </View>
            
            <View style={styles.modalbuttons}>
              <Button info style={styles.modalbutton1} onPress={() => this.addtocart(this.state.itemID, this.state.productname, this.state.productprice, this.state.currency)}>
                <Text style={styles.modaltext1}> 
                  Add to Cart
                </Text>
              </Button>

              <Button info style={styles.modalbutton2} onPress={this.toggleModal}>
                <Text style={styles.modaltext2}> 
                  Cancel
                </Text>
              </Button>
            </View>
          {/* </View> */}
        </Modal>
      </View>

    

    </View>

      
    )
    }
  }
}

export default withNavigation(Card)

const styles = StyleSheet.create({
  container: {
    width: 320,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5
  },
  modalcontainer: {
    // width: 320,
    backgroundColor: 'white',
    marginBottom: 330,
    marginTop: 150,
    // marginVertical: 500,
    padding: 10,
    justifyContent: 'center'
    // shadowColor: 'rgba(0,0,0,0.1)',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 5
  },
  image: {
    height: 150
  },
  modalimage: {
    height: 150,
    marginTop: -10
  },
  modaltagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  modaltitle: {
    fontSize: 16,
    // marginTop: 10,
    marginTop: 5
  },
  modaldescription: {
    color: '#999',
    marginTop: 5,
    // marginTop: 10
  },
  modalbuttons: {
    fontSize: 16,
    // marginTop: 10,
    marginTop: 20,
    flexDirection: 'row',
  },
  modalbutton1: {
    fontSize: 16,
    width: 100,
    marginLeft: 25
  },
  modaltext1: {
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  modalbutton2: {
    fontSize: 16,
    width: 100,
    marginRight: 10,
    marginLeft: 50
  },
  modaltext2: {
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginLeft: 25
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
