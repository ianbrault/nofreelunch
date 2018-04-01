/**
 * src/components/Welcome.js
 */

import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Container, View } from 'native-base';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81c784',
    },
    preview: {
        flex: 1,
        width: 300,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 40,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 6,
        borderColor: '#519657',
        borderRadius: 4
    },
    image: {
        width: 60,
        height: 60,
        marginBottom: 20
    }
});


export default class Welcome extends React.Component {
    takePicture() {
        console.log("say cheese");
    }

    render() {
        return (
            <Container style={ styles.container }>
                <RNCamera
                    ref={cam => { this.camera = cam }}
                    style={ styles.preview }
                >
                <TouchableOpacity onPress={ this.takePicture.bind(this) }>
                    <Image source={ require('../img/camera.png') } style={ styles.image } />
                </TouchableOpacity>
                </RNCamera>
            </Container>
        );
    }
}
