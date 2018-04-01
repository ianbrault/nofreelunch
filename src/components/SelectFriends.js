/**
 * src/components/SelectFriends.js
 */

import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Container, List, ListItem, Text, View } from 'native-base';

import add from '../img/add.png';


const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
        paddingTop: 30,
        backgroundColor: '#81c784',
    },
    headerBorder: {
        height: 6,
        backgroundColor: '#519657'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003300',
        paddingTop: 8
    },
    listContainer: {
        marginLeft: -30
    },
    buttonRow: {
        flexDirection: "row", 
        justifyContent: "center"
    },
    button: {
        width: 200,
        marginTop: 50,
        marginBottom: 50
    },
    buttonText: {
        color: '#90a4ae',
        fontWeight: 'bold'
    },
    listItem: {
        fontSize: 20
    },
    addButton: {
        width: 35,
        height: 35,
        marginLeft: 30,
        marginRight: 15
    },
    selected: {
        backgroundColor: '#c8e6c9'
    },
    unselected: {}
});


const friendsList = [
    "Lucas Jenkins",
    "Ian Brault",
    "Michael Meadow",
    "Krish Seth",
    "Hassan Tarek",
    "Ben Hofilena",
]; 


class Header extends React.Component {
    render() {
        return (
            <React.Fragment>
                <View style={ styles.header }>
                    <Text style={ styles.title }>Select everyone involved in the order</Text>
                </View>
                <View style={ styles.headerBorder }></View>
            </React.Fragment>
        );
    }
}


export default class SelectFriends extends React.Component {
    constructor(props) {
        super(props);
        this.receiptData = this.props.data;

        var selected = new Array(friendsList.length);
        selected.fill(0);
        this.state = {
            selected: selected
        }
    }

    getSelected() {
        var friends = [];
        for (var i = 0; i < friendsList.length; i++) {
            if (this.state.selected[i]) friends.push(friendsList[i]);
        }
        return friends;
    }

    handleDone() {
        var friends = this.getSelected();
        if (friends.length > 0) {
            Actions.Receipt({ 
                selected: friends,
                data: this.receiptData 
            });
        }
    }

    selectFriend(i) {
        var newSelected = this.state.selected.slice();
        newSelected[i] = this.state.selected[i] ? 0 : 1;
        this.setState({ selected: newSelected });
    }

    renderFriends() {
        return friendsList.map((zero, index) => {
            var style = (this.state.selected[index] !== 0) ? styles.selected : styles.unselected;
            return (
                <ListItem key={index} style={ style }>
                    <TouchableOpacity onPress={ () => this.selectFriend(index) }>
                        <Image source={ add } style={ styles.addButton } />
                    </TouchableOpacity>
                    <Text style={ styles.listItem }>{ friendsList[index] }</Text>
                </ListItem>
            );
        });
    }

    render() {
        return (
            <Container>
                <Header />
                <ScrollView>
                    <List style={ styles.listContainer }>
                        { this.renderFriends() }
                    </List>
                    <View style={ styles.buttonRow }>
                        <Button block light style={ styles.button } onPress={ this.handleDone.bind(this) }>
                            <Text style={ styles.buttonText }>DONE</Text>
                        </Button>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}
