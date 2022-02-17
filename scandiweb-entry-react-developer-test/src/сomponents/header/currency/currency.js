import React, { Component } from 'react';
import './currency.css';
import arrowIsDropdownClose from './arrowIsDropdownClose.svg';
import arrowIsDropdownOpen from './arrowIsDropdownOpen.svg';
import CurrencyDropdown from "./currency-dropdown/currency-dropdown";

export default class Currency extends Component {

    constructor() {
        super();
        this.state = {
            isDropdownOpen: false,
            currencies: null
        }
    }

    componentDidMount() {
        this.setState({
            currencies: [...this.props.currencies]
        })
    }

    onDropdownToggle = () => {
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        })
    };

    render() {
        const { isDropdownOpen, currencies } = this.state;
        const { onCurrencyChange, currentCurrency } = this.props;

        return (
            <div className='currency'>
                <button type='button'
                        className='currency-btn'
                        onClick={() => this.onDropdownToggle()}>

                    <span>{currentCurrency}</span>

                    { isDropdownOpen ?
                        <img src={arrowIsDropdownOpen} alt='arrow'/> :
                        <img src={arrowIsDropdownClose} alt='arrow'/>}
                </button>

                { isDropdownOpen ?
                    <CurrencyDropdown onDropdownToggle={this.onDropdownToggle}
                                      onCurrencyChange={onCurrencyChange}
                                      currencies={currencies} />
                    : null }
            </div>
        )
    }
}