import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './cart-overlay.css'
import CartProductList from "../../../cart-product-list/cart-product-list";

export default class CartOverlay extends Component {
    componentDidMount() {
        document.addEventListener('click', this.eventHandler)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.eventHandler)
    }

    eventHandler = (event) => {
        if (!event.target.closest('.cart-overlay')
            && !event.target.closest('.minus')) {
            if (!event.target.closest('.cart')
                || event.target.closest('.cart-overlay-wrapper')) {
                this.props.onOverlayToggle();
            }
        }
    };

    render() {
        const { productsQuantity,
                cart,
                total,
                currentCurrency,
                checkOut,
                changeQuantityByOne,
                onOverlayToggle,
                checkOutLabelNotification,
                changeCheckOutLabelNotification } = this.props;

        return (
            <div className='cart-overlay-wrapper'>
                <div className='cart-overlay-container'>
                    <div className='cart-overlay'>
                        <div className='label'>
                            <span>My bag, </span>
                            <span>{`${productsQuantity} items`}</span>
                        </div>

                        <CartProductList cart={cart}
                                         currentCurrency={currentCurrency}
                                         changeQuantityByOne={changeQuantityByOne}
                                         excludeArrows={true}/>

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
                                if ( cart.length ) {
                                    onOverlayToggle()
                                } else { changeCheckOutLabelNotification() }
                            }}>
                                { checkOutLabelNotification ?
                                    checkOutLabelNotification
                                    : 'CHECK OUT' }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}