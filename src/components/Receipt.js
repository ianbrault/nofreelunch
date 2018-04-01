/**
 * src/components/Receipt.js
 */

import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, List, ListItem, Text } from 'native-base';

import add from '../img/add.png';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81c784'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 40,
        marginBottom: 30
    },
    titleView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listView: {
        width: 300,
        marginTop: 10,
        marginBottom: 10
    },
    itemList: {
        backgroundColor: 'white'
    },
    listItem: {
        fontSize: 20
    },
    label: {
        fontSize: 24,
        color: 'white'
    },
    addButton: {
        width: 35,
        height: 35,
        marginLeft: 10,
        marginRight: 10
    },
});


export default class Receipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }

        this.selectedFriends = this.props.selected;
        this.receiptData = this.props.data;

        this.total = 0.0, this.tax = 0.0;
        var totalAmount = this.receiptData.totalAmount;
        var taxAmount = this.receiptData.taxAmount;
        if (totalAmount && totalAmount.data) this.total = totalAmount.data;
        if (taxAmount && taxAmount.data) this.tax = taxAmount.data;
        this.subtotal = this.total - this.tax;
    }

    componentWillMount() {
        // filter receipt items
        var receiptItems = [];
        for (var i = 0; i < this.receiptData.amounts.length; i++) {
            var item = this.receiptData.amounts[i];

            var filter = (item.data !== 0);
            filter &= (item.data !== this.total && item.data !== this.subtotal && item.data !== this.tax);
            filter &= (!item.text.toUpperCase().includes('TAX'));

            if (filter) {
                // remove currency symbols and amount from string
                var numstr = item.data.toString();
                var datastr = (item.data < 1) ? '0' + numstr : numstr;
                if (datastr.length <= 3) datastr += '0';
                var text = item.text.replace('$', '').replace(datastr, '').replace(numstr, '');

                // extract quantity
                var quantityRegex = /\d+\s*.+/;
                var quantity = 1;
                if (text.match(quantityRegex)) {
                    quantity = Number.parseInt(text.split(' ')[0]);
                    text = text.split(' ').slice(1).join(' ');
                }

                receiptItems.push({ 
                    text: text,
                    amount: item.data, 
                    amountStr: datastr,
                    quantity: quantity
                });
            }
        }
        this.setState({ items: receiptItems });
    }

    renderItems() {
        var items = [];
        var runningTotal = 0.0;
        for (var i = 0, running = 0.0; i < this.state.items.length && running < this.subtotal; i++) {
            var item = this.state.items[i];
            items.push(
                <ListItem key={ i }>
                    <TouchableOpacity onPress={ () => { } }>
                        <Image source={ add } style={ styles.addButton } />
                    </TouchableOpacity>
                    <Text style={ styles.listItem }>
                        0   |   { item.text }: ${ item.amountStr }
                    </Text>
                </ListItem>
            );
            running += item.amount;
        }
        return items;
    }

    renderFriendItemLists(itemList) {
        return this.selectedFriends.map((zero, index) => {
            return (
                <View key={ index } style={ styles.listView }>
                    <Text style={ styles.label }>{ this.selectedFriends[index] }:</Text>
                    { itemList }
                </View>
            );
        });
    }

    render() {
        var itemList = (
            <List style={ styles.itemList }>
                { this.renderItems() }
            </List>
        );

        var friendItemLists = this.renderFriendItemLists(itemList);

        return (
            <Container style={ styles.container }>
                <ScrollView showsVerticalScrollIndicator={ false }>
                    <View style={ styles.titleView }>
                        <Text style={ styles.title }>Who got what?</Text>
                    </View>
                    { friendItemLists }
                </ScrollView>
            </Container>
        );
    }
}
