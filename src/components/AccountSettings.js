/**
 * src/components/Login.js
 */

import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Container, Text } from 'native-base';

import left_arrow from '../img/left_arrow.png';


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
        backgroundColor: '#81c784',
    },
    headerBorder: {
        height: 6,
        backgroundColor: '#519657'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        paddingTop: 12
    },
    arrow: {
        width: 50,
        height: 50,
        marginTop: 13,
        marginLeft: -80
    }
});


export default class AccountSettings extends React.Component {
    goToHome() {
        Actions.Home();
    }

    render() {
        return (
            <Container>
                <View style={ styles.header }>
                    <TouchableOpacity onPress={ this.goToHome }>
                        <Image source={ left_arrow } style={ styles.arrow }/>
                    </TouchableOpacity>
                    <Text style={ styles.title }>ACCOUNT SETTINGS</Text>
                </View>
                <View style={ styles.headerBorder }></View>
            </Container>
        );
    }
}
