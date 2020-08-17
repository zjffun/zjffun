import React from 'react';
import PropTypes from 'prop-types';

import createCollection from '../Collection/createCollection';

// Load Styling
import './Tools.scss';

import toolsData from '../../assets/tools.yaml';

export default class Tools extends React.Component {
  render() {
    return <React.Fragment>{createCollection(toolsData)}</React.Fragment>;
  }
}
