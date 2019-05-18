import React from 'react';
import PropTypes from 'prop-types';

import Colletcion from '../Collection/Collection';

// Load Styling
import './Tools.scss';

import toolsData from '../../tools/tools.yaml';

export default class Tools extends React.Component {
  render() {
    return <React.Fragment>{createCollection(toolsData)}</React.Fragment>;
  }
}

function createCollection(node, title = '', path = '') {
  let items = [],
    childrens = [];
  for (const title in node) {
    if (node.hasOwnProperty(title)) {
      const element = node[title];
      if (typeof element === 'string') {
        items.push([title, element]);
      } else {
        childrens.push([title, createCollection(element, title, `${path}-${title}`)]);
      }
    }
  }
  // eslint-disable-next-line no-debugger
  // debugger;
  return (
    <Colletcion title={title} items={items}>
      {childrens.map(c => (
        <React.Fragment key={c[0]}>{c[1]}</React.Fragment>
      ))}
    </Colletcion>
  );
}
