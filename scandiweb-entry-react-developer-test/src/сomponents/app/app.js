import React, {Component} from 'react';
import {Routes, Route} from "react-router-dom";
import './app.css';
import GraphqlService from "../../services/graphql-service";
import ProductListingPage from "../product-listing-page/product-listing-page";
import ProductDescriptionPage from "../product-description-page/product-description-page";
import Header from '../header/header'
import Loading from "../loading/loading";
import CartPage from "../cart-page/cart-page";

export default class App extends Component {

    graphqlService = new GraphqlService();

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            serverErrorMessage: false,
            unknownError: false,

            categoriesNames: null,
            selectedCategory: null,
            categoryProducts: null,
            currentCurrency: null,

            productsIdToRender: null,

            cart: [],
            total: 0,

        }
    };

    componentDidMount() {
        this.graphqlService.getCategories()
            .then(({ categories }) => {
                this.setState({
                    categoriesNames: categories.map((category) => category.name),
                    selectedCategory: categories[0].name,
                });
            })
            .catch((error) => {
                console.log(`Error happened. ${error}`);
                this.setState({
                    serverErrorMessage: `Server is not available now.\n Please, start server endpoint from this root directory or contact the store owner.`,
                    isLoading: false,
                })
            });

        this.graphqlService.getCurrencies()
            .then((data) => {
                this.setState({
                    currentCurrency: data.currencies[0].symbol
                })
            })
            .catch((error) => {
                console.log(`Query for currencies failed, error ${error}`)
            });

        if ( window.localStorage.getItem('savedCart') &&
             window.localStorage.getItem('savedCart').length ) {
            this.setState({
                cart: JSON.parse(window.localStorage.getItem('savedCart'))
            })
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedCategory !== this.state.selectedCategory) {
            this.graphqlService.getCategory(this.state.selectedCategory)
                .then(({ category: { products } }) => {
                    if ( this.state.productsIdToRender === null ) {
                        let newArray = [];
                        products.forEach((product) => {
                            newArray.push(product.id)
                        });
                        this.setState({
                            productsIdToRender: newArray
                        })
                    }
                    this.setState({
                        categoryProducts: products,
                        isLoading: false,
                    });
                })
                .catch((error) => {
                    console.log(`Error happened. ${error}`);
                    this.setState({
                        serverErrorMessage: `Server is not available now.\n Please, start server endpoint from this root directory or contact the store owner.`,
                        isLoading: false,
                    })
                });
        }
        if (prevState.cart !== this.state.cart ||
            prevState.currentCurrency !== this.state.currentCurrency) {
            let newTotal = 0;
            this.state.cart.forEach((element) => {
                element.prices.forEach((price) => {
                    if ( price.currency.symbol === this.state.currentCurrency ) {
                        newTotal += price.amount*element.quantity;
                    }
                });
            });
            this.setState({
                total: this.state.currentCurrency + newTotal.toFixed(2)
            });

            window.localStorage.setItem('savedCart', JSON.stringify(this.state.cart))
        }
    }

    componentDidCatch(error, errorInfo) {
        console.log(`Error happened. ${error}`);
        this.setState({ unknownError: 'Sorry, we have some problems with site' })
    }

    onCategoryChange = ( selectedCategory ) => {
        this.setState({ selectedCategory });
    };

    onCurrencyChange = ( symbol ) => {
        this.setState({ currentCurrency: symbol })
    };

    addToCart = ( product ) => {
        const cart = this.state.cart;
        const idx = cart.findIndex((element) => {
            return JSON.stringify(element.attributes) === JSON.stringify(product.attributes)
        });
        if ( !cart[idx] ) {
            this.setState(({ cart }) => {
                const newCart = [
                    ...cart,
                    product
                ];
                return {
                    cart: newCart
                }
            })
        } else if ( cart[idx] ) {
            this.setState(({ cart }) => {
                const newProductForCart = {...cart[idx]};
                newProductForCart.quantity++;
                const newCart = [
                    ...cart.slice( 0, idx ),
                    newProductForCart,
                    ...cart.slice( idx + 1 )
                ];
                return {
                    cart: newCart,
                }
            })
        }
    };

    changeQuantityByOne = ( product, sign ) => {
        const cart = this.state.cart;
        const idx = cart.findIndex((element) => {
            return JSON.stringify(element.attributes) === JSON.stringify(product.attributes)
        });
        if ( sign === 'plus' ) {
            this.setState(({ cart }) => {
                const newProductForCart = {...cart[idx]};
                newProductForCart.quantity++;
                const newCart = [
                    ...cart.slice( 0, idx ),
                    newProductForCart,
                    ...cart.slice( idx + 1 )
                ];
                return {
                    cart: newCart,
                }
            })
        }
        if ( sign === 'minus' ) {
            if ( product.quantity === 1 ) {
                this.setState(({ cart }) => {
                    const newCart = [
                        ...cart.slice( 0, idx ),
                        ...cart.slice( idx + 1 )
                    ];
                    return {
                        cart: newCart,
                    }
                })
            } else {
                this.setState(({ cart }) => {
                    const newProductForCart = {...cart[idx]};
                    newProductForCart.quantity--;
                    const newCart = [
                        ...cart.slice( 0, idx ),
                        newProductForCart,
                        ...cart.slice( idx + 1 )
                    ];
                    return {
                        cart: newCart,
                    }
                })
            }

        }
    };

    checkOut = () => {
        if ( !this.state.cart.length ) return;
        console.log(JSON.stringify(this.state.cart));
        alert('Thank you very much for shopping!\n' +
            'Shopping request sent to console.');
        this.setState({
            cart: []
        })
    };

    render() {
        const { isLoading,
            serverErrorMessage,
            unknownError,
            selectedCategory,
            categoryProducts,
            categoriesNames,
            currentCurrency,
            productsIdToRender,
            cart,
            total } = this.state;

        if ( isLoading || serverErrorMessage || unknownError ) {
            return (
                <div className='app'>
                    <Loading isLoading={isLoading}/>
                    <div className='server-error'>{serverErrorMessage}</div>
                    <div className='server-error'>{unknownError}</div>
                </div>
            )
        }

        return (
            <div className='app'>
                <Header categoriesNames={categoriesNames}
                        selectedCategory={selectedCategory}
                        currentCurrency={currentCurrency}
                        cart={cart}
                        total={total}
                        onCategoryChange={this.onCategoryChange}
                        onCurrencyChange={this.onCurrencyChange}
                        checkOut={this.checkOut}
                        changeQuantityByOne={this.changeQuantityByOne}
                />
                <Routes>
                    <Route path='/'
                           element={<ProductListingPage categoryProducts={categoryProducts}
                                                        currentCurrency={currentCurrency}
                                                        addToCart={this.addToCart}/>}/>
                    <Route path={`/cart`}
                           element={<CartPage cart={cart}
                                              total={total}
                                              currentCurrency={currentCurrency}
                                              checkOut={this.checkOut}
                                              changeQuantityByOne={this.changeQuantityByOne}/>}/>
                    {productsIdToRender.map((id) => {
                        return (
                            <Route path={`/${id}`}
                                   key={id}
                                   element={
                                       <ProductDescriptionPage
                                       productId={id}
                                       addToCart={this.addToCart}
                                       currentCurrency={currentCurrency}/>
                                   }/>
                        )
                    })}
                </Routes>
            </div>
        )
    }
}