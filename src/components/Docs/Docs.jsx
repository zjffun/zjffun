import React from 'react';
import PropTypes from 'prop-types';

import createCollection from '../Collection/createCollection';

// Load Styling
import './Docs.scss';

import docsData from '../../docs/docs.yaml';

export default class Tools extends React.Component {
  render() {
    return <React.Fragment>{createCollection(docsData)}</React.Fragment>;
  }
}
