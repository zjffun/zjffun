import React from 'react';
import Link from '../Link/Link';
import Container from '../Container/Container';
import Icon from '../../assets/site-logo.jpg';
import CC from '../../assets/cc.svg';
import BY from '../../assets/by.svg';
import './Footer.scss';

const Footer = () => (
  <footer className="footer">
    <Container className="footer__inner">
      <section className="footer__left">
        <Link className="footer__link" to="">友情链接1</Link>
        <Link className="footer__link" to="">友情链接9</Link>
      </section>

      <section className="footer__middle">
        <Link to="/" className="footer__icon">
          <img src={ Icon } alt="webpack icon" />
        </Link>
      </section>

      <section className="footer__right">
        <Link className="footer__link" to="">聊天</Link>
        <Link className="footer__link" to="">大事记录</Link>
        <Link className="footer__link footer__license" to="/license">
          <img
            alt="Creative Commons License"
            src={ CC } />
          <img
            alt="Creative Commons License"
            src={ BY } />
        </Link>
      </section>
    </Container>
  </footer>
);

export default Footer;
