import React, { Component } from 'react';
import './currency-dropdown.css'

export default class CurrencyDropdown extends Component {
    componentDidMount() {
        document.addEventListener('click', this.eventHandler)
    }

    eventHandler = (event) => {
        if (!event.target.closest('.currency-dropdown') &&
            !event.target.closest('.currency')) {
            this.props.onDropdownToggle();
        }
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.eventHandler)
    }

    render() {
        const { currencies,
            onDropdownToggle,
            onCurrencyChange } =this.props;

        return (
            <div className='currency-dropdown'>
                { currencies.map(({symbol, label}) => {
                    return (
                        <button className='currency-dropdown-btn'
                                onClick={() => {
                                    onCurrencyChange(symbol);
                                    onDropdownToggle()}}
                                key={label}>
                            <span>{symbol}</span>
                            <span>{label}</span>
                        </button>
                    )
                })}
            </div>
        )
    }
}