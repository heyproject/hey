import React from 'react'
import { Platform, View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native'
import { withNavigation } from 'react-navigation'
import Tag from './Tag'
// import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'react-native-firebase';

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

  async getProduct()
    { var that = this;
      var i = 0;
      var photoID = 0;
      
      if (this.state.mounted == true) {
      var i = 0;
      var photoID = 0;

      const db = firebase.firestore();
            db.settings({ timestampsInSnapshots: true});
                    const query = db.collection('Products').where('available', '==', 'Y').limit(10);
                    const snapshot = await query.get();
                    // query.then(snapshot => {
                    //   if (!snapshot.empty){
                    //   snapshot.forEach(doc => {
                    //                    that.setState({
                    //                                  ProductID: doc.id,
                    //                                  Product: doc.data(),
                    //                                  loaded: true
                    //                                  });
                    //                    })
                    //   }});

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
                    // const itemsurl =itemsID[i];
                    // i = i + 1;

                    // console.warn(this.state.items);
                    var storage = firebase.storage();
                    for (var i = 0; i <= itemsID.length - 1; i++) {
                      // photoId = i + 1;
                      // console.warn(itemsID[i]);
                      
                      this.setState({ productname: this.state.items[i].productname 
                      });
                      // console.warn(itemsID[i]);

                      refPath = storage.ref(itemsID[i]);
                      
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

                  
        // const ref = firebase.storage().ref(itemsurl);
        // const data = await ref.getDownloadURL().then(data => {
        //     this.setState({ url: data })
        //     this.setState({ loading: false })
        // }).catch(error => {
        //     this.setState({ url: "/Products/holland-martabak.jpg" })
        //     this.setState({ loading: false })
        // })


        // console.warn(this.state.url);
    }

    // console.warn(this.state.productname);

    // console.warn(this.state.url);
    

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

    if (this.state.url.length == 0) {
      return null
    }
    else {
      // console.warn(this.state.url);
      // console.warn(this.state.productname);
    return (
      <View style={this.props.style}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Menu')}>
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
            <Text style={styles.description}>$$ . Healthy</Text>
            <View style={styles.tagContainer}>
              <Tag>25-35 min</Tag>
              <Tag>4.6 (500+)</Tag>
              <Tag>Price: AUD {this.state.productprice}</Tag>
            </View>
          </View>
        </TouchableOpacity>
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
