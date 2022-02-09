import React, { Component } from 'react';
import './cart.css';
import cartImage from './cart.svg';
import CartOverlay from "./cart-overlay/cart-overlay";

export default class Cart extends Component {
    constructor() {
        super();
        this.state = {
            isOverlayOpen: false,
            productsQuantity: 0,
        }
    }

    componentDidMount() {
        this.countQuantity();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.cart !== this.props.cart) {
            this.countQuantity()
        }
    }

    countQuantity = () => {
        let quantity = 0;
        this.props.cart.forEach((element) => {
            quantity += element.quantity;
        });
        this.setState({
            productsQuantity: quantity,
        })
    };

    onOverlayToggle = () => {
        this.setState({ isOverlayOpen: !this.state.isOverlayOpen })
    };

    render() {
        const { isOverlayOpen,
                productsQuantity } = this.state;
        const { currentCurrency,
                cart,
                total,
                checkOut,
                changeQuantityByOne, } = this.props;

        return (
            <div className='cart'>
                <button type='button'
                        className={`cart-btn ${productsQuantity ? 'quantity' : ''}`}
                        data-quantity={productsQuantity ? productsQuantity : ''}
                        onClick={() => this.onOverlayToggle()}>
                    <img src={cartImage} alt='cart'/>
                </button>

                { isOverlayOpen ?
                    <CartOverlay onOverlayToggle={this.onOverlayToggle}
                                 productsQuantity={productsQuantity}
                                 cart={cart}
                                 total={total}
                                 currentCurrency={currentCurrency}
                                 checkOut={checkOut}
                                 changeQuantityByOne={changeQuantityByOne}/> :
                    null}

            </div>
        )
    }
}