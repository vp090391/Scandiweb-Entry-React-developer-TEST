import React, {Component} from 'react';
import './attributes.css';

export default class Attributes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attributes: [],
            selectedAttributes: [],
        }
    }

    componentDidMount() {
        this.setState({
            attributes: [...this.props.attributes].sort((a,b) => {
                return (a.type > b.type) ? -1 : ((b.type > a.type) ? 1 : 0)
            })
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedAttributes !== this.props.selectedAttributes) {
            this.setState({
                selectedAttributes: this.props.selectedAttributes,
            });
        }
        if (prevProps.attributes !== this.props.attributes) {
            this.setState({
                attributes: [...this.props.attributes].sort((a,b) => {
                    return (a.type > b.type) ? -1 : ((b.type > a.type) ? 1 : 0)
                })
            });
        }
    }

    render() {
        const { attributes, selectedAttributes } = this.state;
        const { selectAttribute } = this.props;

        return (
            <>
                { attributes.length ?
                    attributes.map(({ id, items, name, type }) => {
                        return (
                            <div key={id}
                                 className='attribute'>
                                <div className='attr-name'>
                                    {name.toUpperCase()}:
                                </div>

                                <div className='items'>
                                    {items.map(({ id, value, displayValue }) => {

                                        const clazz = type === 'text' ?
                                            'text-attr-btn'
                                            : 'swatch-attr-btn';

                                        const backgroundColor = type === 'text' ? '' : value;

                                        let clazzSelected = '';
                                        const idx = selectedAttributes.findIndex(( attribute ) => {
                                            return (attribute.id === id
                                                    && attribute.name === name)
                                        });
                                        if (idx >= 0) {
                                            clazzSelected = type === 'text' ?
                                                'text-attr-btn-selected'
                                                : 'swatch-attr-btn-selected' }

                                        return (
                                            <button type='button'
                                                    className={`${clazz} ${clazzSelected}`}
                                                    style={{background: backgroundColor}}
                                                    onClick={() => selectAttribute({
                                                        type,
                                                        name,
                                                        id,
                                                        value,
                                                        displayValue
                                                    })}
                                                    key={id}>
                                                { type === 'text' ? value : null }
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                    : null }
            </>
        )
    }
}