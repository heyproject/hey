import React, {Component} from 'react';
import { Text, View } from 'react-native';
import {IconButton} from 'react-native-paper';
import Drawer from './Drawer';

export default class UserMenu extends React.Component {
    openDrawer(){
        this.refs.DRAWER.open()
    }

    renderSideMenu(){
        return(
            <View style={{flex:1}}>
                <Text>Account</Text>
                <Text>Sign Out</Text>
            </View>
        )
    }

    renderTopRightView(){
        return(
            <View>
                <Text></Text>
            </View>
        )
    }

    render() {
        return(
            <Drawer
            ref="DRAWER"
            sideMenu={this.renderSideMenu()}
            topRightView={this.renderTopRightView()}
            >
                <IconButton icon="menu" size={40} title="open drawer" onPress={()=>this.openDrawer()} />
            </Drawer>
        )
    }
}