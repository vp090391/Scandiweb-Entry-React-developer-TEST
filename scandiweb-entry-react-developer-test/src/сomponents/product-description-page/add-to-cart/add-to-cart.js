import React, { Component } from 'react';
import './add-to-cart.css';

export default class AddToCart extends Component {
    render() {
        const { inStock, 
                combineProduct, 
                cartLabelNotification } = this.props;

        const cartLabel = inStock ?
            cartLabelNotification || 'ADD TO CART'
            : 'OUT OF STOCK';
        const clazz = inStock ? '' : 'out-of-stock-cart';

        return (
            <div className='add-to-cart'>
                <button type='button'
                        className={`add-to-cart-btn ${clazz}`}
                        onClick={() => combineProduct()}>
                    {cartLabel}
                </button>
            </div>
        )
    }
}