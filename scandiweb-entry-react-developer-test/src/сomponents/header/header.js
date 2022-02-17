import React, {Component} from 'react';
import './header.css';
import Currency from "./currency/currency";
import Cart from "./cart/cart";
import Logo from './logo/logo';
import Nav from "./nav/nav";

export default class Header extends Component {
    render() {
        const { categoriesNames,
                currentCurrency,
                currencies,
                onCurrencyChange,
                checkOut,
                changeQuantityByOne,
                cart,
                total } = this.props;

        return (
            <header className='header'>
                <Nav categoriesNames={categoriesNames}/>

                <Logo />

                <Currency currentCurrency={currentCurrency}
                          currencies={currencies}
                          onCurrencyChange={onCurrencyChange}/>

                <Cart cart={cart}
                      total={total}
                      currentCurrency={currentCurrency}
                      checkOut={checkOut}
                      changeQuantityByOne={changeQuantityByOne}/>
            </header>
        )
    }
}