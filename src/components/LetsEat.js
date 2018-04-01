/**
 * src/components/LetsEat.js
 */

import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import Camera, { RNCamera } from 'react-native-camera';
import { Actions } from 'react-native-router-flux';
import { Container, View } from 'native-base';

import camera from '../img/camera.png';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81c784',
    },
    camera: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 300,
        height: 600,
        borderWidth: 8,
        borderColor: '#519657'
    },
    image: {
        width: 60,
        height: 60,
        marginBottom: 20
    }
});


function queryTaggun(imageData) {
    var path = imageData.uri.split('/');
    var taggun_url = "https://api.taggun.io/api/receipt/v1/verbose/encoded";
    console.log("querying ", taggun_url);

    fetch(taggun_url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            apikey: ' 788fdbf034bc11e89ba52979e39c3e3c',
        },
        body: JSON.stringify({
            image: imageData.base64,
            filename: path[path.length - 1],
            contentType: 'image/jpeg',
            language: 'en'
        })
    }).then(res => res.json()).then(receiptInfo => {
        console.log("received response: ", receiptInfo);
        if (receiptInfo.statusCode !== 418) Actions.SelectFriends({ data: receiptInfo });
        else Actions.LetsEat();
    }).catch(err => {
        console.log("error: ", err);
    });
}


export default class Welcome extends React.Component {
    snap() {
        if (this.camera) {
            // send to loading screen
            Actions.Loading();

            const options = { quality: 1.0, base64: true };
            this.camera.takePictureAsync(options).then(data => {
                queryTaggun(data)
            }).catch(err => {
                console.err(err)
            });
        }
    }

    render() {
        return (
            <Container style={ styles.container }>
            <RNCamera 
                style={ styles.camera }
                ref={ ref => this.camera = ref }
                aspect={ Camera.constants.Aspect.fill }
                orientation={ Camera.constants.Orientation.portrait } 
                type={ Camera.constants.Type.back }
            >
            <TouchableOpacity onPress={ this.snap.bind(this) }>
                <Image source={ camera } style={ styles.image } />
            </TouchableOpacity>
            </RNCamera>
            </Container>
        );
    }
}

/*

*/
