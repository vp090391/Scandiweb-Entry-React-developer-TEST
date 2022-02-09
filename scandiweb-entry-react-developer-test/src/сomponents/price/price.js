import React, { Component } from 'react';
import './price.css'

export default class Price extends Component {
    render() {
        const { prices, currentCurrency } = this.props;

        return (
            <>
                {prices.map(({ currency, amount }) => {
                    if ( currency.symbol === currentCurrency ) {
                        return (
                            <div key={amount}>
                                <span>{currency.symbol}</span>
                                <span>{amount.toFixed(2)}</span>
                            </div>
                        )
                    } return null;
                })}
            </>
        )
    }
}