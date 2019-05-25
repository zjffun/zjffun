import React from 'react';
import PropTypes from 'prop-types';

import createCollection from '../Collection/createCollection';

// Load Styling
import './Softwares.scss';

import softwaresData from '../../softwares/softwares.yaml';

export default class Tools extends React.Component {
  render() {
    return <React.Fragment>{createCollection(softwaresData)}</React.Fragment>;
  }
}
