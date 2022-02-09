import React, { Component } from 'react';
import './cart-product-list-attributes.css';

export default class CartProductListAttributes extends Component {
    constructor() {
        super();
        this.state = {
            attributes: []
        }
    }

    componentDidMount() {
        this.setState({
            attributes: [...this.props.attributes].sort((a,b) => (a.type > b.type) ? -1 : ((b.type > a.type) ? 1 : 0))
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ( prevProps.attributes !== this.props.attributes ) {
            this.setState({
                attributes: [...this.props.attributes].sort((a,b) => (a.type > b.type) ? -1 : ((b.type > a.type) ? 1 : 0))
            });
        }
    }

    render() {
        const { attributes } = this.state;

        return (
            <>
                {attributes.map(({ displayValue, id, name, type, value }, index) => {
                    const clazz = type === 'text' ? 'text' : 'swatch';
                    const backgroundColor = type === 'text' ? '' : value;
                    return (
                        <div key={index}
                             className='cart-product-attribute'>
                            <div className='cart-product-attribute-name'>{name.toUpperCase()}:</div>
                            <div className={`${clazz}`}
                                 style={{background: backgroundColor}}>
                                { type === 'text' ? value : null }
                            </div>
                        </div>
                    )
                })}
            </>

        )
    }
}


