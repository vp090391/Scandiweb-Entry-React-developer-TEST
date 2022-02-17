import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './nav.css';

export default class Nav extends Component {
    constructor() {
        super();
        this.state = {
            selectedCategory: null,
        }
    }

    observer = new MutationObserver(() => this.comparePathNames());

    comparePathNames = () => {
        let lastPathName = this.state.selectedCategory;
        const pathName = window.location.pathname.split('/')[1];
        if (pathName !== lastPathName) {
            lastPathName = pathName;
            this.setState({
                selectedCategory: pathName ? pathName : 'all'
            });
        }
    };

    componentDidMount() {
        let lastPathName = window.location.pathname.split('/')[1];
        this.setState({
            selectedCategory: lastPathName ? lastPathName : 'all'
        });

        this.observer.observe(document, {subtree: true, childList: true});
    }

    componentWillUnmount() {
        this.observer.disconnect()
    }

    render () {
        const { categoriesNames } = this.props;
        const { selectedCategory } = this.state;

        return (
            <>
                {categoriesNames.map(( name ) => {
                    const clazz = selectedCategory === name ? 'btn-active' : '';
                    const path = name === 'all' ? '' : name;

                    return (
                        <Link to={`/${path}`}
                              key={name}
                              className='nav'>
                            <button type='button'
                                    className={`nav-btn ${clazz}`}>
                                {name.toUpperCase()}
                            </button>
                        </Link>
                    )
                })}
            </>
        )
    }
}