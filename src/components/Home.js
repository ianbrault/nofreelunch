/**
 * src/components/Welcome.js
 */

import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Container, Content, Text, View } from 'native-base';


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        backgroundColor: '#81c784',
        paddingTop: 25,
        paddingBottom: 10
    },
    headerBorder: {
        height: 6,
        backgroundColor: '#519657'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        paddingHorizontal: 3
    },
    logo: {
        width: 50,
        height: 50,
        paddingHorizontal: 3
    },
    buttonContainer: {
        paddingVertical: 30,
        paddingHorizontal: 15
    },
    buttonView: {
        flexDirection: "row", 
        justifyContent: "center"
    },
    button: {
        width: 250,
        height: 50,
        margin: 20
    },
    buttonText: {
        color: '#90a4ae',
        fontWeight: 'bold'
    },
});


// header rendered above main section
class Header extends React.Component {
    render() {
        return (
            <React.Fragment>
                <View style={ styles.header }>
                    <Image source={ require('../img/logo.png') } style={ styles.logo }/>
                    <Text style={ styles.title }>  NO FREE LUNCH</Text>
                </View>
                <View style={ styles.headerBorder }></View>
            </React.Fragment>
        );
    }
}


export default class Home extends React.Component {
    render() {
        return (
            <Container>
                <Header />
                <Content style={ styles.buttonContainer }>
                    <View style={ styles.buttonView }>
                        <Button block light style={ styles.button }>
                            <Text style={ styles.buttonText }>LET'S EAT</Text>
                        </Button>
                    </View>
                    <View style={ styles.buttonView }>
                        <Button block light style={ styles.button }>
                            <Text style={ styles.buttonText }>ADD FRIENDS</Text>
                        </Button>
                    </View>
                    <View style={ styles.buttonView }>
                        <Button block light style={ styles.button }>
                            <Text style={ styles.buttonText }>ACCOUNT SETTINGS</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}
