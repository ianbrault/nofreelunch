/**
 * src/components/ReceiptPicture.js
 */

import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container } from 'native-base';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    receipt: {
        width: 350,
        height: 600
    }
});


export default class ReceiptPicture extends React.Component {
    render() {
        return (
            <Container style={ styles.container }>
                <Image source={ this.props.receipt } style={ styles.receipt }/>
            </Container>
        );
    }
}
