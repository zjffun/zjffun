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
      <div className="collection-container">
        <div className="collection-warp">
          <span className="collection-title">{title}</span>
          <div className="collection-items">
            <ul>
              {items.map(d => (
                <a href={d[1]}>
                  <li className="collection-item">{d[0]}</li>
                </a>
              ))}
            </ul>
          </div>
          <div className="collection-children">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
