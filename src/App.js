/**
 * src/App.js
 */

import React from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Actions, Router, Scene } from 'react-native-router-flux';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import bcrypt from "react-native-bcrypt";
import isaac from "isaac";

import allReducers from './reducers/index.js';
import CreateAccount from './components/CreateAccount';
import Home from './components/Home';
import Loading from './components/Loading';
import Login from './components/Login';
import Welcome from './components/Welcome';


/*{
    <Camera
        ref={cam => { this.camera = cam }}
        style={ styles.preview }>
    <View style={ styles.camera_view }>
        <TouchableOpacity
            onPress={ this.takePicture.bind(this) }
            style = { styles.capture }>
        </TouchableOpacity>
    </View>
    </Camera>
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 400,
    },
    camera_view: {
        flex: 0, 
        flexDirection: 'row', 
        justifyContent: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 25,
        alignSelf: 'center',
        margin: 20
    },
}*/

bcrypt.setRandomFallback((len) => {
	const buf = new Uint8Array(len);
	return buf.map(() => Math.floor(isaac.random() * 256));
});

const store = createStore(allReducers);

export default class App extends React.Component {
    handleRegisterSubmit(data) {
        // display load screen
        Actions.Loading();

        // validate fields
        const emailRegex = /.+@.+\..+/;
        if (data.firstname === '' || data.lastname === '') {
            Actions.CreateAccount({ validationErr: "Please provide a name" });
            return;
        } else if (data.username === '' && data.email === '') {
            Actions.CreateAccount({ validationErr: "Please provide either a username or email" });
            return;
        } else if (data.email !== '' && !data.email.match(emailRegex)) {
            Actions.CreateAccount({ validationErr: "Invalid email address" });
            return;
        } else if (data.dob === '') {
            Actions.CreateAccount({ validationErr: "Please provide your date of birth" });
            return;
        } else if (data.address === '') {
            Actions.CreateAccount({ validationErr: "Please provide your address" });
            return;
        } else if (data.city === '') {
            Actions.CreateAccount({ validationErr: "Please provide your city" });
            return;
        } else if (data.state === '' || data.state.length !== 2) {
            Actions.CreateAccount({ validationErr: "Invalid state" });
            return;
        } else if (data.postalcode === '' || data.postalcode.length !== 5) {
            Actions.CreateAccount({ validationErr: "Invalid postalcode" });
            return;
        } else if (data.ssn === '' || data.ssn.length !== 4) {
            Actions.CreateAccount({ validationErr: "Invalid SSN" });
            return;
        } else if (data.password === '') {
            Actions.CreateAccount({ validationErr: "Please provide a password" });
            return;
        } else if (data.password !== data.confPassword) {
            Actions.CreateAccount({ validationErr: "Passwords do not match" });
            return;
        }

        data.state = data.state.toUpperCase();

        // validate DOB
        const dobRegex1 = /\d{8}/;
        const dobRegex2 = /\d{2}(\/|-)\d{2}(\/|-)\d{4}/;
        const dobRegex3 = /\d{1}(\/|-)\d{2}(\/|-)\d{4}/;
        const dobRegex4 = /\d{2}(\/|-)\d{1}(\/|-)\d{4}/;
        const dobRegex5 = /\d{1}(\/|-)\d{1}(\/|-)\d{4}/;
        if (data.dob.match(dobRegex1)) {
            data.dob = data.dob.substring(0, 2) + '-' 
                + data.dob.substring(2, 4) + '-'
                + data.dob.substring(4);
        } else if (data.dob.match(dobRegex2)) {
            data.dob = data.dob.replace('/', '-');
        } else if (data.dob.match(dobRegex3)) {
            data.dob = data.dob.replace('/', '-');
            data.dob = '0' + data.dob;
        } else if (data.dob.match(dobRegex4)) {
            data.dob = data.dob.replace('/', '-');
            data.dob = data.dob.substring(0, 3) + '0' + data.dob.substring(3);
        } else if (data.dob.match(dobRegex5)) {
            data.dob = data.dob.replace('/', '-');
            data.dob = '0' + data.dob.substring(0, 2) + '0' + data.dob.substring(2);
        } else {
            Actions.CreateAccount({ validationErr: "Invalid DOB format (MM-DD-YYYY)" });
            return;
        }

        // encrypt provided password
        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(salt + data.password, salt, (err, hash) => {
                // replace plaintext password with hashed one
                delete data.confPassword;
                data.password = hash;
                Alert.alert('Submitted!', JSON.stringify(data));
                // Actions.Home();
            });
        });
    }

    handleLoginSubmit(data) {
        if (data.user === '') {
            Actions.Login({ validationErr: "No username provided" });
            return;
        } 

        // attempt to fetch stored password for username/email
        // salt is first 29 characters of stored bcrypt hash

        var storedSalt = "$2a$12$Jwfsi9sHpeNsIYEZ97TlOO";
        bcrypt.hash(storedSalt + data.password, storedSalt, (err, hash) => {
            // invalid password if no match
            Alert.alert('Submitted!', JSON.stringify(data));
            // Actions.Home();
        });
    }

    render() {
        return (
            <Provider store={ store }>
                <Router>
                    <Scene key="root">
                        {/* welcome page to login or register */}
                        <Scene
                            initial={ true }
                            component={ Welcome }
                            hideNavBar={ true }
                            key='Welcome'
                            title='Welcome'
                        />
                        {/* account creation page */}
                        <Scene
                            component={ CreateAccount }
                            hideNavBar={ true }
                            onSubmit={ this.handleRegisterSubmit }
                            key='CreateAccount'
                            title='CreateAccount'
                        />
                        {/* login page */}
                        <Scene
                            component={ Login }
                            hideNavBar={ true }
                            onSubmit={ this.handleLoginSubmit }
                            key='Login'
                            title='Login'
                        />
                        {/* main home page */}
                        <Scene
                            component={ Home }
                            hideNavBar={ true }
                            key='Home'
                            title='Home'
                        />
                        {/* loading splash screen */}
                        <Scene
                            component={ Loading }
                            hideNavBar={ true }
                            key='Loading'
                            title='Loading'
                        />
                    </Scene>
                </Router>
            </Provider>
        );
    }
}
