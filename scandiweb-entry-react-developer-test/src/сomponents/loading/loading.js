import React, { Component } from 'react';
import './loading.css';
import loading from './loading.svg';

export default class Loading extends Component {
    render() {
        return (
            <div className='loading'>
                { this.props.isLoading ?
                    <img src={loading} alt='loading...'/>
                    : null }
            </div>
        )
    }
}