import React, {Component} from 'react';
import './description.css';

// If to use 'dangerouslySetInnerHTML' property is not good,
// I think the better way is to use the 'html-react-parser',
// but since it is not allowed to use third-party libraries
// I solved the data presentation problem in the following way.

export default class Description extends Component {

    componentDidMount() {
        this.renderHtml()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.description !== this.props.description) {
            document.querySelector('.description').innerHTML = '';
            this.renderHtml()
        }
    }

    renderHtml = () => {
        const childrensToRender = [...new DOMParser()
            .parseFromString(this.props.description, 'text/html')
            .getElementsByTagName('body')[0].children
        ];

        if (!childrensToRender.length) {
            document.querySelector('.description').innerHTML = this.props.description
        } else {
            childrensToRender.forEach((element) => {
                let htmlToRender = document.createElement(`${element.localName}`);
                htmlToRender.innerHTML = element.innerHTML;
                document.querySelector('.description').appendChild(htmlToRender);
            })
        }
    };

    render() {
        return (
            <div className='description'>
            </div>
        )
    }
}