import React from 'react';
import styles from './Blogs.scss';
import { extractPages } from '../../utilities/content-utils';

export default props => {
  const { sections, section } = props;
  const pages = extractPages(section);
  return (
    <main className={styles.blogs}>
      <article className={styles.blogs__article}>
        <ul>
          {pages.map(d => (
            <li key={d.path}>
              <a href={d.url}>
                <div className={styles.blog}>
                  <h3 className={styles.blog__title}>{d.name}</h3>
                  <p className={styles.blog__digest}>
                    {d.digest || '这个人太懒了，咩有写摘要'}
                  </p>
                  <p className={styles.blog__info}>
                    <span className={styles['blog__post-tiem']}>
                      {d.postTime}
                    </span>
                    阅读时间：
                    <span className={styles['blog__reading-time']}>
                      {d.size}
                    </span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </article>
      <aside className={styles.blogs__aside}>
        <section className={styles.section}>
          <p className={styles.section__title}>分类</p>
          <ul className={styles.items}>
            {sections.map(d => (
              <li
                key={d.path}
                className={[
                  styles.items__item,
                  d.name === section.name ? styles['items__item--active'] : ''
                ]}
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
