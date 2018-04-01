/**
 * src/components/Welcome.js
 */

import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Container, Text } from 'native-base';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81c784',
    },
    loadText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20
    },
});


export default class Welcome extends React.Component {
    loginPress() {
        Actions.Login();
    }

    registerPress() {
        Actions.CreateAccount();
    }

    render() {
        return (
            <Container style={ styles.container }>
                <Text style={ styles.loadText }>LOADING...</Text>
                <ActivityIndicator size="large" color="#e1e2e1"/>
            </Container>
        );
    }
}
