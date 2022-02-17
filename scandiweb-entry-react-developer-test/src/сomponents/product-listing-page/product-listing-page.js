import React, {Component} from 'react';
import './product-listing-page.css';
import ProductCard from "./product-card/product-card";
import GraphqlService from "../../services/graphql-service";
import Loading from "../loading/loading";

export default class ProductListingPage extends Component {

    graphqlService = new GraphqlService();

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            serverErrorMessage: false,

            categoryProducts: null,
        }
    };

    componentDidMount() {
        this.getCategoryData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ( prevProps.category !== this.props.category ) {
            this.getCategoryData()
        }
    }

    getCategoryData = async () => {
        await this.graphqlService.getCategory(this.props.category)
            .then(({ category: { products } }) => {
                this.setState({
                    categoryProducts: [...products],
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
    };

    render() {
        const { category,
                addToCart,
                currentCurrency } = this.props;
        const { isLoading,
                serverErrorMessage,
                categoryProducts } = this.state;

        if ( isLoading || serverErrorMessage) {
            return (
                <div className='app'>
                    <Loading isLoading={isLoading}/>
                    <div className='server-error'>{serverErrorMessage}</div>
                </div>
            )
        }

        return (
            <main className='product-listing-page'>
                <div className='products-label'>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>

                <div className='products'>
                    {categoryProducts.map((product) => {
                        return (
                            <div className='product-wrapper'
                                 key={product.id}>
                                <ProductCard product={product}
                                             currentCurrency={currentCurrency}
                                             addToCart={addToCart}/>
                            </div>
                        )
                    })}
                </div>
            </main>
        )
    }
}