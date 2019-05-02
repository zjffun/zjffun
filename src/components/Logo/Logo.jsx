import React from 'react';
import Logo from '../../assets/site-logo.jpg';
import './Logo.scss';

export default () => {
  return (
    <React.Fragment>
      <img className="logo" src={Logo} alt="webpack logo" />
      <h1 className="title">zjffun</h1>
    </React.Fragment>
  );
};
