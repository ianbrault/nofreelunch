/**
 * src/components/Receipt.js
 */

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, List, ListItem } from 'native-base';


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


export default class Receipt extends React.Component {
    constructor(props) {
        super(props);

        this.receiptData = this.props.data;
        this.total = (this.receiptData.totalAmount.data) ? this.receiptData.totalAmount.data : 0.0;
        this.tax = (this.receiptData.taxAmount.data) ? this.receiptData.taxAmount.data : 0.0;
        this.subtotal = this.total - this.tax;

        // filter totals, tax, subtotals out of receipt items
        this.receiptItems = [];
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
                this.receiptItems.push({ text: text, amount: item.data, amountStr: datastr });
            }
        }
    }

    renderItems() {
        var items = [];
        var runningTotal = 0.0;
        for (var i = 0, running = 0.0; i < this.receiptItems.length && running < this.subtotal; i++) {
            var item = this.receiptItems[i];
            items.push(<ListItem key={i}><Text>{ item.text }: ${ item.amountStr }</Text></ListItem>);
            running += item.amount;
        }
        return items;
    }

    render() {
        return (
            <Container style={ styles.container }>
                <List>
                    { this.renderItems() }
                </List>
            </Container>
        );
    }
}
