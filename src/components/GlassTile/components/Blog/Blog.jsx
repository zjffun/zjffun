// Import External Dependencies
import React from 'react';

// Import Utilities
import { randomPickPage } from '@/utilities/content-utils';

// Import Components
import styles from './Blog.scss';
import Markdown from '@/components/Markdown/Markdown';
import importBlog from '@/importBlog';

// Load Content Tree
import Content from '@/blogs/_blogs.json';

class Blog extends React.Component {
  state = {
    page: randomPickPage(Content),
    content: null,
    contentLoading: true
  };

  componentDidMount() {
    this.fetchPage();
  }

  fetchPage = () => {
    const { page } = this.state;
    try {
      const content = importBlog(page.path.replace('src/blogs/', ''));
      if (content instanceof Promise) {
        content
          .then(module =>
            this.setState({
              content: module.default || module,
              contentLoading: true
            })
          )
          .catch(error =>
            this.setState({
              content: 'Error loading content.'
            })
          )
          .finally(_ => {
            this.setState({
              contentLoading: false
            });
          });
      }
    } catch (e) {
      this.setState({
        content: e.toString()
      });
    }
  };

  render() {
    const { contentLoading, content, page } = this.state;
    return (
      <article className={styles.blog}>
        <h3 className={styles.blog__title}>
          {!contentLoading && page.url.replace('/blogs/', '')}
          <span onClick={this.fetchPage}>换一篇</span>
        </h3>
        <article className={styles.blog__content}>
          <Markdown>
            <div
              dangerouslySetInnerHTML={{
                __html: content
              }}
            />
          </Markdown>
        </article>
      </article>
    );
  }
}

export default Blog;
