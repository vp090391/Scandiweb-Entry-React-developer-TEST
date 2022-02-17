import React, { Component } from 'react';
import './cart-page.css';
import CartProductList from "../cart-product-list/cart-product-list";

export default class CartPage extends Component {
    constructor() {
        super();
        this.state = {
            checkOutLabelNotification: null
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.cart !== this.props.cart && !prevProps.cart.length) {
            this.changeCheckOutLabelNotification()
        }
    }

    changeCheckOutLabelNotification = () => {
        if (!this.props.cart.length) {
            this.setState({
                checkOutLabelNotification: 'CHOOSE SOMETHING'
            })
        } else {
            this.setState({
                checkOutLabelNotification: null
            })
        }
    };

    render() {
        const { cart,
                total,
                currentCurrency,
                checkOut,
                changeQuantityByOne } = this.props;
        const { checkOutLabelNotification } = this.state;

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
                    <button type='button' onClick={() => {
                        checkOut();
                        if (!cart.length) { this.changeCheckOutLabelNotification() }}}>
                        { checkOutLabelNotification ? checkOutLabelNotification : 'CHECK OUT'}
                    </button>
                </div>
            </div>
        )
    }
}