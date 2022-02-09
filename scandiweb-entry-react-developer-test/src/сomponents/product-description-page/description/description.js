import React, {Component} from 'react';
import './description.css';

export default class Description extends Component {

    render() {
        const { description } = this.props;

/*
        In real project use something to sanitize 'description'
*/

        return (
            <div className='description' dangerouslySetInnerHTML={{__html: description}}>
            </div>
        )
    }
}