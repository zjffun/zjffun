// Import External Dependencies
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot as Hot } from 'react-hot-loader';
import DocumentTitle from 'react-document-title';

// Import Utilities
import {
  extractPages,
  extractSections,
  getPageTitle
} from '../../utilities/content-utils';
import isClient from '../../utilities/is-client';

// Import Components
import NotificationBar from '../NotificationBar/NotificationBar';
import Navigation from '../Navigation/Navigation';
import SidebarMobile from '../SidebarMobile/SidebarMobile';
import Container from '../Container/Container';
import Splash from '../Splash/Splash';
import Sponsors from '../Sponsors/Sponsors';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import Page from '../Page/Page';
import Gitter from '../Gitter/Gitter';
import Blogs from '../Blogs/Blogs';
import Organization from '../Organization/Organization';
import Tools from '../Tools/Tools';
// import StarterKits from '../StarterKits/StarterKits';

// Load Styling
import '../../styles/index';
import '../../styles/icon.font.js';
import './Site.scss';

// Load Content Tree
import Content from '../../blogs/_blogs.json';

const sections = extractSections(Content);

const links = [
  {
    content: 'Blog',
    url: '/blogs',
    isActive: url => /^\/(blogs)/.test(url),
    children: _strip(sections)
  },
  { content: '在线工具', url: '/tools' },
  { content: '常用文档', url: '/docs' },
  { content: '软件', url: '/softwares' },
  { content: 'ACG', url: '/acg' }
];

class Site extends React.Component {
  state = {
    mobileSidebarOpen: false
  };

  render() {
    let { location } = this.props;
    let { mobileSidebarOpen } = this.state;
    let section = sections.find(({ url }) => location.pathname.startsWith(url));
    let pages = extractPages(Content);

    return (
      <div className="site">
        <DocumentTitle title={getPageTitle(Content, location.pathname)} />
        {/* <NotificationBar /> */}
        <Navigation
          pathname={location.pathname}
          toggleSidebar={this._toggleSidebar}
          links={links}
        />

        {isClient ? (
          <SidebarMobile
            isOpen={mobileSidebarOpen}
            sections={[{ content: '主页', url: '/' }, ...links]}
            toggle={this._toggleSidebar}
          />
        ) : null}

        <Switch>
          <Route path="/" exact component={Splash} />
          <Route
            render={props => (
              <Container className="site__content">
                <Switch>
                  <Route
                    exact
                    path="/blogs"
                    render={() => <Blogs sections={sections} />}
                  />
                  <Route exact path="/tools" component={Tools} />
                  <Route path="/organization" component={Organization} />
                  {sections.map(section => (
                    <Route
                      key={section.url}
                      exact
                      path={section.url}
                      render={() => {
                        return <Blogs sections={sections} section={section} />;
                      }}
                    />
                  ))}
                  {pages.map(page => (
                    <Route
                      key={page.url}
                      exact
                      path={page.url}
                      render={props => {
                        let path = page.path.replace('src/blogs/', '');
                        let content = this.props.import(path);

                        return (
                          <React.Fragment>
                            <Sponsors />
                            <Sidebar
                              className="site__sidebar"
                              currentPage={location.pathname}
                              pages={_strip(
                                section
                                  ? section.children
                                  : Content.children.filter(
                                      item =>
                                        item.type !== 'directory' &&
                                        item.url !== '/'
                                    )
                              )}
                              section={section}
                              page={page}
                            />
                            <Page {...page} content={content} />
                            <Gitter />
                          </React.Fragment>
                        );
                      }}
                    />
                  ))}
                  <Route render={props => '404 Not Found'} />
                </Switch>
              </Container>
            )}
          />
        </Switch>
        <Footer />
      </div>
    );
  }

  /**
   * Toggle the mobile sidebar
   *
   * @param {boolean} open - Indicates whether the menu should be open or closed
   */
  _toggleSidebar = (open = !this.state.mobileSidebarOpen) => {
    this.setState({
      mobileSidebarOpen: open
    });
  };
}

/**
 * Strip any non-applicable properties
 *
 * @param  {array} array - ...
 * @return {array}       - ...
 */
function _strip(array) {
  let anchorTitleIndex = array.findIndex(
    item => item.name.toLowerCase() === 'index.md'
  );

  if (anchorTitleIndex !== -1) {
    array.unshift(array[anchorTitleIndex]);

    array.splice(anchorTitleIndex + 1, 1);
  }

  return array.map(({ title, name, url, group, sort, anchors, children }) => ({
    title: title || name,
    content: title || name,
    url,
    group,
    sort,
    anchors,
    children: children ? _strip(children) : []
  }));
}

export default Hot(module)(Site);
