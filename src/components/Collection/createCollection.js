import React from 'react';
import Colletcion from './Collection';

export default function createCollection(node, title = '', path = '') {
  let items = [],
    childrens = [];
  for (const title in node) {
    if (node.hasOwnProperty(title)) {
      const element = node[title];
      const key = `${path}-${title}`;
      if (typeof element === 'string') {
        items.push({
          link: element,
          key,
          name: title
        });
      } else if (typeof element._url === 'string') {
        items.push({
          link: element._url,
          desc: element._desc,
          key,
          name: title
        });
      } else {
        childrens.push([key, createCollection(element, title, key)]);
      }
    }
  }

  return (
    <Colletcion title={title} items={items}>
      {childrens.map(c => (
        <React.Fragment key={c[0]}>{c[1]}</React.Fragment>
      ))}
    </Colletcion>
  );
}
