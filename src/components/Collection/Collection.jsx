import React from 'react';
import PropTypes from 'prop-types';

// Load Styling
import './Collection.scss';

export default class Collection extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    theme: PropTypes.string,
    items: PropTypes.array
  };

  static defaultProps = {
    title: 'hello world',
    theme: '',
    items: []
  };
  render() {
    let { title, items } = this.props;
    return (
      <div style={{border: '1px solid #000', padding: '5px'}}>
        {title}
        <br/>
        {items.map(d => d.join(',')).join(';')}
        <br/>
        {this.props.children}
      </div>
    );
  }
}
