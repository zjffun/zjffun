import React from 'react';
import './SidebarItem.scss';

const block = 'sidebar-item';

export default class SidebarItem extends React.Component {
  state = {};

  render() {
    let { title, id, level } = this.props;
    return (
      <div className={`${block}`}>
        <a className={`${block}__title ${block}-level-${level}`} href={`#${id}`}>
          {title}
        </a>
      </div>
    );
  }
}
