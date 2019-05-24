import React from 'react';
import './Blogs.scss';
import { extractPages } from '../../utilities/content-utils';

export default props => {
  const { sections, section } = props;
  const pages = extractPages(section);
  return (
    <main className="blogs">
      <article className="blogs__article">
        <ul>
          {pages.map(d => (
            <li key={d.path}>
              <a href={d.url}>
                <div className="blog">
                  <h3 className="blog__title">{d.name}</h3>
                  <p className="blog__digest">
                    {d.digest || '这个人太懒了，咩有写摘要'}
                  </p>
                  <p className="blog__info">
                    <span className="blog__post-tiem">{d.postTime}</span>
                    阅读时间：
                    <span className="blog__reading-time">{d.size}</span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </article>
      <aside className="blogs__aside">
        <section className="section">
          <p className="section__title">分类</p>
          <ul className="items">
            {sections.map(d => (
              <li
                key={d.path}
                className={`items__item ${
                  d.name === section.name ? 'items__item--active' : ''
                }`}
              >
                <a href={d.url}>{d.name}</a>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </main>
  );
};
