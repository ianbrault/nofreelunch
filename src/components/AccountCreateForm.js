/**
 * src/components/AccountCreateForm.js
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
    }
});


// header rendered above form component
class FormHeader extends React.Component {
    render() {
        return (
            <React.Fragment>
                <View style={ styles.header }>
                    <Text style={ styles.title }>Create an account</Text>
                </View>
                <View style={ styles.headerBorder }></View>
            </React.Fragment>
        );
    }
}


const validate = values => {
    const error = {};
    error.name = '';
    error.email = '';
    error.accountNum = '';
    error.routingNum = '';

    if (values.name === undefined) values.name = '';
    if (values.email === undefined) values.email = '';
    if (values.accountNum === undefined) values.accountNum = '';
    if (values.routingNum === undefined) values.routingNum = '';
    
    // validate email address
    var emailRegex = /.+@.+\..+/;
    if (!values.email.match(emailRegex) && values.email !== '')
        error.email = "invalid email address";

    // US routing numbers are 9 digits long
    if (values.routingNum.length !== 9 && values.routingNum.length !== 0)
        error.routingNum = "US routing numbers must be 9 digits long";

    return error;
};


class AccountCreateForm extends React.Component {
    renderInput({ input, label, type, meta: { touched, error, warning } }) {
        var hasError = false;
        if (error !== undefined) hasError = true;

        return ( 
            <Item error={ hasError } floatingLabel>
                <Label>{ label }</Label>
                <Input { ...input } />
                { hasError ? <Text>{ error }</Text> : <Text /> }
            </Item>
        );
    }

    render() {
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
                            name={ 'email' }
                            label={ 'Email' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'accountNum' }
                            label={ 'Account number' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'routingNum' }
                            label={ 'Routing number' }
                            component={ this.renderInput }
                        />
                        <Button block primary style={ styles.button } onPress={ this.props.handleSubmit }>
                            <Text>Submit</Text>
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
})(AccountCreateForm);
