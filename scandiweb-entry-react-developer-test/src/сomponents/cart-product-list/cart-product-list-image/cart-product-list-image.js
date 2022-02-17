import React, { Component } from 'react';
import './cart-product-list-image.css';
import leftArrow from "../left-arrow.svg";
import rightArrow from "../right-arrow.svg";

export default class CartProductListImage extends Component {
    constructor() {
        super();
        this.state = {
            gallery: [],
            imageIndex: 0,
        }
    }

    componentDidMount() {
        this.setState({
            gallery: [...this.props.gallery]
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.gallery !== this.props.gallery) {
            this.setState({
                gallery: [...this.props.gallery]
            })
        }
    }

    increaseImageIndex = () => {
        const { gallery, imageIndex } = this.state;
        if (gallery.length === 1) { return }
        if (imageIndex === gallery.length - 1) {
            this.setState({
                imageIndex: 0
            })
        } else {
            this.setState({
                imageIndex: imageIndex + 1
            })
        }
    };

    decreaseImageIndex = () => {
        const { gallery, imageIndex } = this.state;
        if (gallery.length === 1) { return }
        if (imageIndex === 0) {
            this.setState({
                imageIndex: gallery.length - 1
            })
        } else {
            this.setState({
                imageIndex: imageIndex - 1
            })
        }
    };

    render() {
        const { excludeArrows } =this.props;
        const { imageIndex, gallery } = this.state;

        return (
            <div className='product-image'>
                { gallery.length === 1 || excludeArrows ? null :
                    <>
                        <button type='button' className='left-arrow'
                                onClick={() => this.decreaseImageIndex()}>
                            <img src={leftArrow} alt="left arrow"/>
                        </button>
                        <button type='button' className='right-arrow'
                                onClick={() => this.increaseImageIndex()}>
                            <img src={rightArrow} alt="right arrow"/>
                        </button>
                    </>
                }

                <img src={gallery[imageIndex]} alt='product'/>
            </div>
        )
    }
}