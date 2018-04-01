/**
 * src/components/AccountSettings.js
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
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
});


class Header extends React.Component {
    render() {
        return (
            <React.Fragment>
                <View style={ styles.header }>
                    <Text style={ styles.title }>Account Settings</Text>
                </View>
                <View style={ styles.headerBorder }></View>
            </React.Fragment>
        );
    }
}

export default class AccountSettings extends React.Component {
    render() {
        return (
            <Container style={ styles.container }>
                <Header />
            </Container>
        );
    }
}
