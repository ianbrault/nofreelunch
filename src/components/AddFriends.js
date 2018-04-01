/**
 * src/components/AddFriends.js
 */

import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Container, Input, Item, Label, Text } from 'native-base';

import left_arrow from '../img/left_arrow.png';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#81c784',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 40,
        marginBottom: 30,
        marginLeft: 0
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
    },
    buttonRow: {
        flexDirection: "row", 
        justifyContent: "center"
    },
    button: {
        width: 200,
        marginTop: 40,
        marginBottom: 50
    },
    buttonText: {
        color: '#90a4ae',
        fontWeight: 'bold'
    },
    searchBox: {
        width: 300,
        height: 300,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        width: 220,
        backgroundColor: 'white'
    },
    arrow: {
        width: 50,
        height: 50,
        marginTop: 13,
        marginLeft: -80
    }
});


export default class AddFriends extends React.Component {
    render() {
        return (
            <Container style={ styles.container }>
                <View style={ styles.navbar }>
                    <TouchableOpacity onPress={ () => Actions.Home() }>
                        <Image source={ left_arrow } style={ styles.arrow }/>
                    </TouchableOpacity>
                    <Text style={ styles.title }>ADD FRIENDS</Text>
                </View>
                <View style={ styles.searchBox }>
                    <Item floatingLabel style={ styles.searchBar }>
                        <Label>Search by username or email</Label>
                        <Input name="search" />
                    </Item>
                    <View style={ styles.buttonRow }>
                        <Button block light style={ styles.button }>
                            <Text style={ styles.buttonText }>DONE</Text>
                        </Button>
                    </View>
                </View>
            </Container>
        );
    }
}
