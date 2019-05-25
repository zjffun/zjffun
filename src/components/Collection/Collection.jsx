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
    let { title, items, children } = this.props;
    return (
      <div className="collection-container">
        <div className="collection-warp">
          <span className="collection-title">{title}</span>
          <div className="collection-items">
            <ul>
              {items.map(d => (
                <a href={d.link} key={d.key}>
                  <li className="collection-item">{d.name}</li>
                </a>
              ))}
            </ul>
          </div>
          <div className="collection-children">{children}</div>
        </div>
      </div>
    );
  }
}
