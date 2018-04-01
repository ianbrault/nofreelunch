/**
 * src/components/Login.js
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
        color: '#003300',
        paddingTop: 12
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
    if (data.user === undefined) data.user = '';
    if (data.password === undefined) data.password = '';
}


// header rendered above form component
class FormHeader extends React.Component {
    render() {
        return (
            <React.Fragment>
                <View style={ styles.header }>
                    <Text style={ styles.title }>Login</Text>
                </View>
                <View style={ styles.headerBorder }></View>
            </React.Fragment>
        );
    }
}


class Login extends React.Component {
    renderInput({ input, label, type, meta: { touched, error, warning } }) {
        var hasError = false;
        if (error !== undefined) hasError = true;
        var errorTag = hasError ? <Text style={ styles.error }>{ error }</Text> : <Text />;
        var secure = (label === 'Password');

        return ( 
            <Item error={ hasError } floatingLabel>
                <Label>{ label }</Label>
                <Input secureTextEntry={ secure } { ...input } />
                { errorTag }
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
                            name={ 'user' }
                            label={ 'Username or Email' }
                            component={ this.renderInput }
                        />
                        <Text style={ styles.spacer } />
                        <Field
                            name={ 'password' }
                            label={ 'Password' }
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
    form: 'login',
    validate
})(Login);
