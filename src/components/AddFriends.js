/**
 * src/components/AddFriends.js
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Container, Input, Item, Label, Text } from 'native-base';


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
        marginBottom: 30
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
    searchBar: {
        width: 220,
        backgroundColor: 'white'
    }
});


export default class AddFriends extends React.Component {
    render() {
        return (
            <Container style={ styles.container }>
                <Text style={ styles.title }>ADD FRIENDS</Text>
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
