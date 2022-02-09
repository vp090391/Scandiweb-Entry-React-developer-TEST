import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './cart-overlay.css'
import CartProductList from "../../../cart-product-list/cart-product-list";

export default class CartOverlay extends Component {
    componentDidMount() {
        document.addEventListener('click', this.eventHandler)
    }

    eventHandler = (event) => {
        if (!event.target.closest('.cart-overlay') &&
             !event.target.closest('.cart')) {
            this.props.onOverlayToggle();
        }
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.eventHandler)
    }

    render() {
        const { productsQuantity,
                cart,
                total,
                currentCurrency,
                checkOut,
                changeQuantityByOne,
                onOverlayToggle } = this.props;

        return (
            <div className='cart-overlay'>
                <div className='label'>
                    <span>My bag, </span>
                    <span>{`${productsQuantity} items`}</span>
                </div>

                <CartProductList cart={cart}
                                 currentCurrency={currentCurrency}
                                 changeQuantityByOne={changeQuantityByOne}/>

                <div className='total'>
                    <span>Total</span>
                    <span>{total}</span>
                </div>

                <div className='buttons'>
                    <Link to='/cart' onClick={() => onOverlayToggle()}>
                        VIEW BAG
                    </Link>
                    <button type='button' onClick={() =>{
                        checkOut();
                        onOverlayToggle()
                    }}>
                        CHECK OUT
                    </button>
                </div>
            </div>
        )
    }
}