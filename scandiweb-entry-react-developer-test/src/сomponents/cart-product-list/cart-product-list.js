import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './cart-product-list.css';
import Price from '../price/price';
import CartProductListAttributes from "./cart-product-list-attributes/cart-product-list-attributes";

export default class CartProductList extends Component {
    constructor() {
        super();
        this.state = {
            cart: []
        }
    }

    componentDidMount() {
        this.setState({
            cart: [...this.props.cart].sort((a,b) => (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0))
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.cart !== this.props.cart) {
            this.setState({
                cart: [...this.props.cart].sort((a,b) => (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0))
            })
        }
    }

    render() {
        const { cart } = this.state;
        const { currentCurrency,
                changeQuantityByOne } = this.props;

        return (
            <>
                {cart.map((product, index) => {
                    const { id, brand, name, prices, attributes, quantity, image } = product;

                    return (
                        <div className='product-item' key={index}>
                            <div className='product-properties'>
                                <div className='product-properties-brand'>{brand}</div>
                                <div className='product-properties-name'>
                                    <Link to={`/${id}`}>
                                        {name}
                                    </Link>
                                </div>
                                <div className='product-properties-price'>
                                    <Price prices={prices}
                                           currentCurrency={currentCurrency}/>
                                </div>
                                <div className='product-properties-attributes'>
                                    <CartProductListAttributes attributes={attributes}/>
                                </div>
                            </div>

                            <div className='product-quantity'>
                                <button type='button'
                                        className='plus'
                                        onClick={() => changeQuantityByOne(product, 'plus')}>
                                    <span>+</span>
                                </button>
                                <div className='number'>{quantity}</div>
                                <button type='button'
                                        className='minus'
                                        onClick={() => changeQuantityByOne(product, 'minus')}>
                                    <span>–</span>
                                </button>
                            </div>

                            <div className='product-image'>
                                <Link to={`/${id}`}>
                                    <img src={image} alt='product'/>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }
}