// Import External Dependencies
import React from 'react';
import Banner from 'react-banner';

// Import Components
import Link from '../Link/Link';
import Container from '../Container/Container';
import Logo from '../Logo/Logo';
import Dropdown from '../Dropdown/Dropdown';

// Import helpers
import isClient from '../../utilities/is-client';

// Load Styling
import 'docsearch.js/dist/cdn/docsearch.css';
import './Navigation.scss';
import './Search.scss';

export default class Navigation extends React.Component {
  render() {
    let { pathname, links, toggleSidebar } = this.props;

    return (
      <Banner
        blockName="navigation"
        logo={ <Logo light={ true } /> }
        url={ pathname }
        items={[
          ...links,
          {
            title: 'GitHub Repository',
            url: 'https://github.com/zjffun/zjffun',
            className: 'navigation__item--icon',
            content: <i aria-hidden="true" className="icon-github" />
          },
          // {
          //   className: 'navigation__item--icon',
          //   content: (
          //     <Dropdown
          //       className="navigation__languages"
          //       items={[
          //         { title: 'English', url: 'https://webpack.js.org/' },
          //         { lang: 'zh', title: '中文', url: 'https://webpack.docschina.org/' }
          //       ]} />
          //   )
          // }
        ]}
        link={ Link }
        onMenuClick={ toggleSidebar } />
    );
  }

  componentDidMount() {
    if (isClient) {
      const DocSearch = require('docsearch.js');

      DocSearch({
        apiKey: 'fac401d1a5f68bc41f01fb6261661490',
        indexName: 'webpack-js-org',
        inputSelector: '.navigation-search__input'
      });
    }
  }
}
