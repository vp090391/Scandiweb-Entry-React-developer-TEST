import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './product-card.css';
import addToCartIcon from './addToCartIcon.svg';
import Price from "../../price/price";
import Attributes from "../../product-description-page/attributes/attributes";
import AddToCart from "../../product-description-page/add-to-cart/add-to-cart";

export default class ProductCard extends Component {
    constructor() {
        super();
        this.state = {
            product: {
                id: null,
                name: null,
                inStock: null,
                gallery: null,
                attributes: null,
                prices: null,
                brand: null,
            },

            selectedAttributes: [],
            cartLabelNotification: null,

            isAttributesPopupOpen: false,
        }
    }

    componentDidMount() {
        this.setState({
            product: this.props.product
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedAttributes.length !== this.state.selectedAttributes.length) {
            if (this.state.product.attributes.length === this.state.selectedAttributes.length) {
                this.setState({ cartLabelNotification: null })
            }
        }
        if (this.state.isAttributesPopupOpen === true ) {
            document.addEventListener('click', this.eventHandler)
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.eventHandler)
    }

    onAttributesPopupToggle = () => {
        this.setState({
            isAttributesPopupOpen: !this.state.isAttributesPopupOpen
        })
    };

    eventHandler = (event) => {
        if (!event.target.closest('.attributes-popup') &&
            !event.target.closest('.product-list-add-to-cart-btn')) {
            this.setState({
                isAttributesPopupOpen: false
            })
        }
    };

    onAttributeSelect = (item) => {
        const array = this.state.selectedAttributes;
        const idx = array.findIndex((element) => {
            return (element.name === item.name)
        });
        if (!array[idx]) {
            this.setState(({ selectedAttributes }) => {
                const newArray = [
                    ...selectedAttributes,
                    item
                ];
                return {
                    selectedAttributes: newArray
                }
            })
        } else if (array[idx].id !== item.id) {
            this.setState(({ selectedAttributes }) => {
                const newArray = [
                    ...selectedAttributes.slice( 0, idx ),
                    item,
                    ...selectedAttributes.slice( idx + 1 )
                ];
                return {
                    selectedAttributes: newArray
                }
            })
        } else if (array[idx].id === item.id) {
            this.setState(({ selectedAttributes }) => {
                const newArray = [
                    ...selectedAttributes.slice( 0, idx ),
                    ...selectedAttributes.slice( idx + 1 )
                ];
                return {
                    selectedAttributes: newArray
                }
            })
        }
    };

    combineProduct = () => {
        const product = this.state.product;
        if (product.inStock) {
            if (product.attributes.length === this.state.selectedAttributes.length) {
                const productForCart = {
                    id: product.id,
                    brand: product.brand,
                    name: product.name,
                    inStock: product.inStock,
                    prices: product.prices,
                    attributes: this.state.selectedAttributes,
                    image: product.gallery[0],
                    quantity: 1,
                };
                this.props.addToCart(productForCart);
                this.setState({
                    isAttributesPopupOpen: false
                })
            } else (this.setState({ cartLabelNotification: 'Please, select all attributes' }))
        }
    };

    render() {
        if (!this.state.product.id) return null;

        const { currentCurrency } = this.props;
        const { product: {
                id,
                name,
                inStock,
                gallery,
                attributes,
                prices,
                brand
            },
            selectedAttributes,
            cartLabelNotification,
            isAttributesPopupOpen } = this.state;

        const clazz = inStock ? "" : 'out-of-stock';

        return (
            <>
                <Link to={`/${id}`}
                      className={`product ${clazz}`}>

                    <img src={gallery[0]} alt='product' className='product-image'/>
                    <div className='product-name'>
                        <span>{brand}</span>
                        <span>{name}</span>
                    </div>

                    <div className='product-amount'>
                        <Price
                            prices={prices}
                            currentCurrency={currentCurrency}/>
                    </div>
                </Link>

                { inStock ?
                    <button type='button'
                            className='product-list-add-to-cart-btn'
                            onClick={() => { this.onAttributesPopupToggle() }}>
                        <img src={addToCartIcon}
                             alt='add to cart note'/>
                    </button>
                    :
                    null }

                { isAttributesPopupOpen ?
                    <div className='attributes-popup'>
                        <Attributes attributes={attributes}
                                    selectAttribute={this.onAttributeSelect}
                                    selectedAttributes={selectedAttributes}/>
                        <AddToCart inStock={inStock}
                                   combineProduct={this.combineProduct}
                                   cartLabelNotification={cartLabelNotification}/>
                    </div>
                    :
                    null }
            </>
        )
    }
}