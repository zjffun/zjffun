// Import External Dependencies
import React from 'react';

import ErrorBoundary from '../ErrorBoundary';
import { Blog, BGM, Sentence } from './components';

import './GlassTile.scss';

const GlassTile = () => (
  <div className="glass-tile-container">
    <ul className="glass-tile">
      <li className="tile blog">
        <ErrorBoundary>
          <Blog />
        </ErrorBoundary>
      </li>
      <li className="tile music">
        <ErrorBoundary>
          <BGM />
        </ErrorBoundary>
      </li>
      <li className="tile motto">
        <ErrorBoundary>
          <Sentence />
        </ErrorBoundary>
      </li>
      <li className="tile tool1">
        <a
          className="tile__contianer"
          href="https://github.com/zjffun/cnblogs-helper"
        >
          <h3>cnblogs-helper</h3>
          <p>一个同步博客园随笔的工具。😉</p>
        </a>
      </li>
      <li className="tile tool2">
        <h2 className="tile-title">在线工具2</h2>
      </li>
      <li className="tile tool3">
        <h2 className="tile-title">在线工具3</h2>
      </li>
      <li className="tile tool4">
        <h2 className="tile-title">在线工具4</h2>
      </li>
      <li className="tile ACG">
        <h2 className="tile-title">ACG</h2>
      </li>
      <li className="tile">
        <h2 className="tile-title">GitHub</h2>
      </li>
      <li className="tile">
        <h2 className="tile-title">Twitter</h2>
      </li>
      <li className="tile">
        <h2 className="tile-title">GitHub</h2>
      </li>
      <li className="tile">
        <h2 className="tile-title">Twitter</h2>
      </li>
    </ul>
  </div>
);

export default GlassTile;
