import React from 'react';
import './Blogs.scss';
import { extractPages } from '../../utilities/content-utils';

import Content from '../../blogs/_blogs.json';

const pages = extractPages(Content);

export default props => {
  const { sections } = props;

  return (
    <main className="blogs blogs-container">
      <article>
        <ul>
          {pages.map(d => (
            <li key={d.path}>
              <a href={d.url}>
                <div className="blog">
                  <h3 className="blog-title">{d.name}</h3>
                  <p className="blog-digest">
                    {d.digest || '这个人太懒了，咩有写摘要'}
                  </p>
                  <p className="blog-info">
                    <span className="blog-post-tiem">{d.postTime}</span>
                    阅读时间：
                    <span className="blog-reading-time">{d.size}</span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </article>
      <aside>
        <section>
          <p className="title">分类</p>
          <ul className="items">
            {sections.map(d => (
              <li key={d.path} className="item">
                <a href={d.url}>{d.name}</a>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </main>
  );
};
