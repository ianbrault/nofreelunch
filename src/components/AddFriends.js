/**
 * src/components/AddFriends.js
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81c784',
    },
});


export default class AddFriends extends React.Component {
    render() {
        return (
            <Container style={ styles.container }>
            </Container>
        );
    }
}
