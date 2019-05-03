import React from 'react';
import Logo from '../../assets/site-logo.jpg';
import './Logo.scss';

export default () => {
  return (
    <React.Fragment>
      <h1 className="web-title"><img className="logo" src={Logo} alt="webpack logo" /> zjffun</h1>
    </React.Fragment>
  );
};
