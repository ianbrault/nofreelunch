/**
 * src/App.js
 */

import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import allReducers from './reducers/index.js';
import CreateAccount from './components/CreateAccount';
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

const store = createStore(allReducers);

export default class App extends React.Component {
    handleSubmit(data) {
        Alert.alert('Submitted!', JSON.stringify(data));
    }

    render() {
        return (
            <Provider store={ store }>
                <Router>
                    <Scene key="root">
                        {/* welcome page to login or register */}
                        <Scene
                            component={ Welcome }
                            hideNavBar={ true }
                            initial={ true }
                            key='Welcome'
                            title='Welcome'
                        />
                        {/* account creation page */}
                        <Scene
                            component={ CreateAccount }
                            hideNavBar={ true }
                            onSubmit={ this.handleSubmit }
                            key='CreateAccount'
                            title='CreateAccount'
                        />
                    </Scene>
                </Router>
            </Provider>
        );
    }
}
