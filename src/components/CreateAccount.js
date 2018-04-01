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
        marginTop: 50,
        marginBottom: 50
    },
    buttonText: {
        fontWeight: 'bold'
    },
    errRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: -10
    },
    err: {
        color: '#af4448',
        fontSize: 16,
        fontWeight: 'bold'
    }
});


const validate = data => {
    if (data.firstname === undefined) data.firstname = '';
    if (data.lastname === undefined) data.lastname = '';
    if (data.username === undefined) data.username = '';
    if (data.email === undefined) data.email = '';
    if (data.dob === undefined) data.dob = '';
    if (data.address === undefined) data.address = '';
    if (data.city === undefined) data.city = '';
    if (data.state === undefined) data.state = '';
    if (data.postalcode === undefined) data.postalcode = '';
    if (data.ssn === undefined) data.ssn = '';
    if (data.password === undefined) data.password = '';
    if (data.confPassword === undefined) data.confPassword = '';
}


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


class CreateAccount extends React.Component {
    renderInput({ input, label, type, meta: { touched, error, warning } }) {
        var secure = (label === 'Password' || label === 'Confirm Password');

        return ( 
            <Item floatingLabel>
                <Label>{ label }</Label>
                <Input secureTextEntry={ secure } { ...input } />
            </Item>
        );
    }

    render() {
        var err = this.props.validationErr ? 
            <View style={ styles.errRow }><Text style={ styles.err }>{ this.props.validationErr }</Text></View>
            : <Text/>;
        return (
            <Container>
                <FormHeader />
                { err }
                <Content style={ styles.form }>
                    <ScrollView keyboardShouldPersistTaps={ 'handled' }>
                        <Field
                            name={ 'firstname' }
                            label={ 'First name' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'lastname' }
                            label={ 'Last name' }
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
                        <Field
                            name={ 'dob' }
                            label={ 'Date of Birth' }
                            placeholder='MM-DD-YYYY'
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'address' }
                            label={ 'Address' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'city' }
                            label={ 'City' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'state' }
                            label={ 'State' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'postalcode' }
                            label={ 'Postal Code' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'ssn' }
                            label={ 'Last 4 digits of SSN' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'password' }
                            label={ 'Password' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'confPassword' }
                            label={ 'Confirm Password' }
                            component={ this.renderInput }
                        />
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
