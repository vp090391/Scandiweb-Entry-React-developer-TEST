import React, { Component } from 'react';
import './product-description-page.css';
import GraphqlService from "../../services/graphql-service";
import Loading from "../loading/loading";
import Price from "../price/price";
import AddToCart from "./add-to-cart/add-to-cart";
import Description from "./description/description";
import Attributes from "./attributes/attributes";

export default class ProductDescriptionPage extends Component {

    graphqlService = new GraphqlService();

    constructor() {
        super();
        this.state = {
            isLoading: true,
            serverErrorMessage: false,

            product: {
                id: null,
                name: null,
                inStock: null,
                gallery: null,
                description: null,
                attributes: null,
                prices: null,
                brand: null,
            },
            productMainPicture: null,
            selectedAttributes: [],

            cartLabelNotification: null,
        }
    }

    componentDidMount() {
        this.getProductData();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedAttributes.length !== this.state.selectedAttributes.length) {
            if (this.state.product.attributes.length === this.state.selectedAttributes.length) {
                this.setState({
                    cartLabelNotification: null
                })
            }
        }
        if ( this.state.product.id !== this.props.productId ) {
            this.getProductData();
        }
        if (prevProps.productId !== this.props.productId) {
            this.setState({
                selectedAttributes: []
            })
        }
    }

    getProductData = async () => {
        await this.graphqlService.getProductData(this.props.productId)
            .then(({ product }) => {
                this.setState({
                    product,
                    productMainPicture: product.gallery[0],
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.log(`Error happened. ${error}`);
                this.setState({
                    serverErrorMessage: `Sorry, store have some problems with data server.`,
                    isLoading: false,
                })
            });
    };

    onProductImageSelect = (image) => {
        this.setState({ productMainPicture: image })
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
        const { id,
                brand,
                name,
                inStock,
                prices,
                category,
                attributes,
                gallery } = this.state.product;
        if (inStock) {
            if (attributes.length === this.state.selectedAttributes.length) {
                const productForCart = {
                    id: id,
                    brand: brand,
                    name: name,
                    inStock: inStock,
                    prices: prices,
                    category: category,
                    attributes: this.state.selectedAttributes,
                    gallery: gallery,
                    quantity: 1,
                };
                this.props.addToCart(productForCart);
            } else (this.setState({
                cartLabelNotification: 'Please, select all attributes'
            }))
        }
    };

    render() {
        const { isLoading,
                serverErrorMessage,
                product: {
                    name,
                    inStock,
                    gallery,
                    description,
                    attributes,
                    prices,
                    brand
                },
                productMainPicture,
                selectedAttributes,
                cartLabelNotification } = this.state;
        const { currentCurrency } = this.props;

        if ( isLoading || serverErrorMessage ) {
            return (
                <div className='product-page'>
                    <Loading isLoading={isLoading}/>
                    <div className='server-error'>{serverErrorMessage}</div>
                </div>
            )
        }

        const clazz = inStock ? '' : 'product-out-of-stock';

        return (
            <div className='product-page'>
                <div className='product-gallery'>
                    {gallery.map(( image ) => {
                        return (
                            <img key={image}
                                 src={image}
                                 alt='product'
                                 onClick={() => this.onProductImageSelect(image)} />
                        )
                    })}
                </div>

                <div className={`product-main-picture ${clazz}`}>
                    <img src={productMainPicture} alt='product'/>
                </div>

                <div className='product-info'>
                    <div className='brand'>{brand}</div>

                    <div className='name'>{name}</div>

                    <Attributes attributes={attributes}
                                selectAttribute={this.onAttributeSelect}
                                selectedAttributes={selectedAttributes}/>

                    <div className='price'>
                        <div className='price-label'>PRICE:</div>

                        <div className='amount'>
                            <Price currentCurrency={currentCurrency}
                                   prices={prices}/>
                        </div>
                    </div>

                    <AddToCart inStock={inStock}
                               combineProduct={this.combineProduct}
                               cartLabelNotification={cartLabelNotification}/>

                    <Description description={description}/>
                </div>
            </div>
        )
    }
}