import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './nav.css';

export default class Nav extends Component {
    render () {
        const { categoriesNames, selectedCategory, onCategoryChange } = this.props;

        return (
            <Link to='/'
                  className='nav'>
                {categoriesNames.map(( name ) => {
                    const isActive = selectedCategory === name;
                    const clazz = isActive ? 'btn-active' : '';

                    return (
                        <button type='button'
                                className={`nav-btn ${clazz}`}
                                key={name}
                                onClick={() => onCategoryChange(name)}>
                            {name.toUpperCase()}
                        </button>
                    )
                })}
            </Link>
        )
    }
}