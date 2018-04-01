/**
 * src/components/CreateAccount.js
 */

import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { Button, Container, Content, Input, Item, Label, Text } from 'native-base';


const styles = StyleSheet.create({
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
    form: {
        paddingVertical: 30,
        paddingHorizontal: 30
    },
    spacer: {
        paddingVertical: 3
    },
    button: {
        marginTop: 50
    },
    buttonText: {
        fontWeight: 'bold'
    },
    oauth: {
        flexDirection: "row", 
        justifyContent: "center"
    }
});


// header rendered above form component
class FormHeader extends React.Component {
    render() {
        return (
            <React.Fragment>
                <View style={ styles.header }>
                    <Text style={ styles.title }>Create an Account</Text>
                </View>
                <View style={ styles.headerBorder }></View>
            </React.Fragment>
        );
    }
}


const validate = values => {
    const error = {};
    return error;
};


class CreateAccount extends React.Component {
    renderInput({ input, label, type, meta: { touched, error, warning } }) {
        var hasError = false;
        if (error !== undefined) hasError = true;

        return ( 
            <Item error={ hasError } floatingLabel>
                <Label>{ label }</Label>
                <Input { ...input } />
            </Item>
        );
    }

    render() {
        const clientID = "ca_Cb6IuD1mSKl8FZLRGhHbjEC6UnYMnYUO";
        const redirect = "nofreelunch://stripeoauth/register/"
        var state = Math.floor(Math.random() * Math.floor(262144));
        var oauth_url = "https://connect.stripe.com/express/oauth/authorize"
            + "?redirect_uri=" + redirect
            + "&client_id=" + clientID 
            + "&state=" + state;
        
        return (
            <Container>
                <FormHeader />
                <Content style={ styles.form }>
                    <ScrollView keyboardShouldPersistTaps={ 'handled' }>
                        <Field
                            name={ 'name' }
                            label={ 'Full name' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'username' }
                            label={ 'Username' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'email' }
                            label={ 'Email' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <View style={ styles.oauth }>
                            <TouchableOpacity onPress={() => Linking.openURL(oauth_url)}>
                                <Image source={ require('../img/light-on-light.png') } />
                            </TouchableOpacity>
                        </View>
                        <Button block primary style={ styles.button } onPress={ this.props.handleSubmit }>
                            <Text style={ styles.buttonText }>SUBMIT</Text>
                        </Button>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}


export default reduxForm({
    form: 'create',
    validate
})(CreateAccount);
