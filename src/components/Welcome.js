/**
 * src/components/Welcome.js
 */

import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Container, Content, Text, View } from 'native-base';


const styles = StyleSheet.create({
    welcomeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81c784',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 15
    },
    title: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
    },
    loginButton: {
        marginTop: 50,
        width: 200
    },
    regButton: {
        marginTop: 20,
        width: 200
    },
    buttonText: {
        color: '#90a4ae',
        fontWeight: 'bold'
    },
    button: {
        flexDirection: "row", 
        justifyContent: "center"
    }
});


export default class Welcome extends React.Component {
    loginPress() {

    }

    registerPress() {
        Actions.CreateAccount();
    }

    render() {
        return (
            <Container style={ styles.welcomeContainer }>
                <Image source={ require('../logo.png') } style={ styles.logo }/>
                <Text style={ styles.title }>NO FREE</Text>
                <Text style={ styles.title }>LUNCH</Text>
                <View style={ styles.button }>
                    <Button block light style={ styles.loginButton }>
                        <Text style={ styles.buttonText }>LOGIN</Text>
                    </Button>
                </View>
                <View style={ styles.button }>
                    <Button block light style={ styles.regButton } onPress={ this.registerPress }>
                        <Text style={ styles.buttonText }>REGISTER</Text>
                    </Button>
                </View>
            </Container>
        );
    }
}
