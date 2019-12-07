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
import Blogs from '../Blogs/Blogs';
import Organization from '../Organization/Organization';
import Tools from '../Tools/Tools';
import Docs from '../Docs/Docs';
import Softwares from '../Softwares/Softwares';
// import StarterKits from '../StarterKits/StarterKits';

// Load Styling
import '../../styles/index';
import '../../styles/icon.font.js';
import './Site.scss';

// Load Content Tree
import blogsContent from '../../blogs/_blogs.json';
import notesContent from '../../notes/_notes.json';

const blogsSections = extractSections(blogsContent);
const notesSections = extractSections(notesContent);

const links = [
  {
    content: 'Blog',
    url: '/blogs',
    isActive: url => /^\/(blogs)/.test(url),
    children: _strip(blogsSections)
  },
  {
    content: 'Note',
    url: '/notes',
    isActive: url => /^\/(notes)/.test(url),
    children: _strip(notesSections)
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
    let sections = [...blogsSections, ...notesSections];
    let section = sections.find(({ url }) => location.pathname.startsWith(url));
    let blogsPages = extractPages(blogsContent);
    let notesPages = extractPages(notesContent);

    return (
      <div className="site">
        <DocumentTitle title={getPageTitle(blogsContent, location.pathname)} />
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
                    render={() => (
                      <Blogs sections={blogsSections} section={blogsContent} />
                    )}
                  />
                  <Route
                    exact
                    path="/notes"
                    render={() => (
                      <Blogs sections={notesSections} section={notesContent} />
                    )}
                  />
                  <Route exact path="/tools" component={Tools} />
                  <Route exact path="/docs" component={Docs} />
                  <Route exact path="/softwares" component={Softwares} />
                  <Route path="/organization" component={Organization} />
                  {blogsSections.map(section => (
                    <Route
                      key={section.url}
                      exact
                      path={section.url}
                      render={() => {
                        return (
                          <Blogs sections={blogsSections} section={section} />
                        );
                      }}
                    />
                  ))}
                  {notesSections.map(section => (
                    <Route
                      key={section.url}
                      exact
                      path={section.url}
                      render={() => {
                        return (
                          <Blogs sections={notesSections} section={section} />
                        );
                      }}
                    />
                  ))}
                  {blogsPages.map(page => (
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
                                  : blogsContent.children.filter(
                                      item =>
                                        item.type !== 'directory' &&
                                        item.url !== '/'
                                    )
                              )}
                              section={section}
                              page={page}
                            />
                            <Page {...page} content={content} />
                          </React.Fragment>
                        );
                      }}
                    />
                  ))}
                  {notesPages.map(page => (
                    <Route
                      key={page.url}
                      exact
                      path={page.url}
                      render={props => {
                        let path = page.path.replace('src/notes/', '');
                        let content = this.props.importNote(path);

                        return (
                          <React.Fragment>
                            <Sponsors />
                            <Sidebar
                              className="site__sidebar"
                              currentPage={location.pathname}
                              pages={_strip(
                                section
                                  ? section.children
                                  : notesContent.children.filter(
                                      item =>
                                        item.type !== 'directory' &&
                                        item.url !== '/'
                                    )
                              )}
                              section={section}
                              page={page}
                            />
                            <Page {...page} content={content} />
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
