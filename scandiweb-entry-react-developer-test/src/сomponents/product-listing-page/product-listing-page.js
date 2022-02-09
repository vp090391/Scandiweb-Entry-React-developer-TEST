import React, {Component} from 'react';
import './product-listing-page.css';
import ProductCard from "./product-card/product-card";

export default class ProductListingPage extends Component {
    render() {
        const { categoryProducts,
            addToCart,
            currentCurrency } = this.props;

        return (
            <main className='products'>
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
            </main>
        )
    }
}