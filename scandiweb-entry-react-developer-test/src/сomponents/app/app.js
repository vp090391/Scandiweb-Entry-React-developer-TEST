import React, {Component} from "react";
import {Routes, Route} from "react-router-dom";
import "./app.css";
import GraphqlService from "../../services/graphql-service";
import ProductListingPage from "../product-listing-page/product-listing-page";
import ProductDescriptionPage from "../product-description-page/product-description-page";
import Header from "../header/header";
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
            currentCurrency: null,
            currencies: null,

            productsForRoutes: null,

            cart: [],
            total: 0,
        }
    };

    componentDidMount = async () => {
        await this.graphqlService.getCategories()
            .then(({ categories }) => {
                this.setState({
                    categoriesNames: categories.map((category) => category.name),
                });
            })
            .catch(error => this.onErrorHandle(error));

        await this.graphqlService.getProductsForRoutes(this.state.categoriesNames[0])
            .then(({ category: { products } }) => {
                this.setState({
                    productsForRoutes: [...products],
                })
            })
            .catch(error => this.onErrorHandle(error));

        await this.graphqlService.getCurrencies()
            .then((data) => {
                const storageCurrency = JSON.parse(window.localStorage
                                            .getItem('currentCurrency'));
                this.setState({
                    currencies: [...data.currencies],
                    currentCurrency: storageCurrency ?
                                        storageCurrency
                                        : data.currencies[0].symbol
                })
            })
            .catch(error => this.onErrorHandle(error));

        if ( window.localStorage.getItem('savedCart')
            && window.localStorage.getItem('savedCart').length ) {
            this.setState({
                cart: JSON.parse(window.localStorage.getItem('savedCart')),
            })
        }

        this.setState({
            isLoading: false
        })
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.cart !== this.state.cart
            || prevState.currentCurrency !== this.state.currentCurrency) {
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
        }
        if (prevState.cart !== this.state.cart) {
            window.localStorage.setItem(
                'savedCart',
                JSON.stringify(this.state.cart))
        }
        if (prevState.currentCurrency !== this.state.currentCurrency) {
            window.localStorage.setItem(
                'currentCurrency',
                JSON.stringify(this.state.currentCurrency))
        }
    }

    componentDidCatch(error, errorInfo) {
        console.log(`Error happened. ${error}`);
        this.setState({ unknownError: 'Sorry, we have some problems with site' })
    }

    onErrorHandle = (error) => {
        console.log(`Error happened. ${error}`);
        this.setState({
            serverErrorMessage: `Server is not available now.\n Please, start server endpoint from this root directory or contact the store owner.`,
            isLoading: false,
        })
    };

    onCurrencyChange = ( symbol ) => {
        this.setState({ currentCurrency: symbol });
    };

    addToCart = ( product ) => {
        const cart = this.state.cart;
        const idx = cart.findIndex((element) => {
            return JSON.stringify(element.id) + JSON.stringify(element.attributes)
                === JSON.stringify(product.id) + JSON.stringify(product.attributes)
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
            return JSON.stringify(element.id) + JSON.stringify(element.attributes)
                === JSON.stringify(product.id) + JSON.stringify(product.attributes)
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
                categoriesNames,
                currentCurrency,
                currencies,
                productsForRoutes,
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
                        currentCurrency={currentCurrency}
                        currencies={currencies}
                        cart={cart}
                        total={total}
                        onCurrencyChange={this.onCurrencyChange}
                        checkOut={this.checkOut}
                        changeQuantityByOne={this.changeQuantityByOne}
                />

                <Routes>
                    {categoriesNames.map((name) => {
                        const path = name === 'all' ? '' : name;
                        return (
                            <Route path={`/${path}`}
                                   key={name}
                                   element={<ProductListingPage category={name}
                                                                currentCurrency={currentCurrency}
                                                                addToCart={this.addToCart}/>}/>
                        )
                    })}

                    <Route path='/cart'
                           element={<CartPage cart={cart}
                                              total={total}
                                              currentCurrency={currentCurrency}
                                              checkOut={this.checkOut}
                                              changeQuantityByOne={this.changeQuantityByOne}/>}/>

                    {productsForRoutes.map((product) => {
                        const { category, id } = product;
                        return (
                            <Route path={`/${category}/${id}`}
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