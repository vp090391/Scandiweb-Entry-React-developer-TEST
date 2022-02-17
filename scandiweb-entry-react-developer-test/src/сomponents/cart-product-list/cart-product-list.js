import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './cart-product-list.css';
import Price from '../price/price';
import CartProductListAttributes from "./cart-product-list-attributes/cart-product-list-attributes";
import CartProductListImage from "./cart-product-list-image/cart-product-list-image";

export default class CartProductList extends Component {
    constructor() {
        super();
        this.state = {
            cart: [],
        }
    }

    componentDidMount() {
        this.setState({
            cart: [...this.props.cart].sort((a,b) => {
                return (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0)
            })
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.cart !== this.props.cart) {
            this.setState({
                cart: [...this.props.cart].sort((a,b) => {
                    return (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0)
                })
            })
        }
    }

    render() {
        const { cart } = this.state;
        const { currentCurrency,
                changeQuantityByOne,
                excludeArrows } = this.props;

        return (
            <>
                {cart.map((product, index) => {
                    const { id,
                            brand,
                            name,
                            prices,
                            category,
                            attributes,
                            quantity,
                            gallery } = product;

                    return (
                        <div className='product-item' key={index}>
                            <div className='product-properties'>
                                <div className='product-properties-brand'>
                                    {brand}
                                </div>

                                <div className='product-properties-name'>
                                    <Link to={`/${category}/${id}`}>
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

                                <div className='number'>
                                    {quantity}
                                </div>

                                <button type='button'
                                        className='minus'
                                        onClick={() => changeQuantityByOne(product, 'minus')}>
                                    <span>–</span>
                                </button>
                            </div>

                            <CartProductListImage gallery={gallery}
                                                  excludeArrows={excludeArrows}/>
                        </div>
                    )
                })}
            </>
        )
    }
}