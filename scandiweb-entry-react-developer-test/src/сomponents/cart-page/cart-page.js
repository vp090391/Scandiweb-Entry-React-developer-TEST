import React, { Component } from 'react';
import './cart-page.css';
import CartProductList from "../cart-product-list/cart-product-list";

export default class CartPage extends Component {
    render() {
        const { cart,
                total,
                currentCurrency,
                checkOut,
                changeQuantityByOne } = this.props;

        return (
            <div className='cart-page'>
                <div className='cart-page-label'>CART</div>
                <CartProductList cart={cart}
                                 currentCurrency={currentCurrency}
                                 changeQuantityByOne={changeQuantityByOne}/>
                <div className='cart-page-total'>
                    <span>Total</span>
                    <span>{total}</span>
                </div>
                <div className='cart-page-checkout'>
                    <button type='button' onClick={() => checkOut()}>
                        CHECK OUT
                    </button>
                </div>
            </div>
        )
    }
}