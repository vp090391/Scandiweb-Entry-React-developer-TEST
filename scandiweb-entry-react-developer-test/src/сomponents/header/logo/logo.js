import React, { Component } from 'react';
import './logo.css'
import logo from './logo.svg'

export default class Logo extends Component {
    render() {
        return (
            <div className='logo'>
                <a href='/'>
                    <img src={logo} alt='logo'/>
                </a>
            </div>
        )
    }
}