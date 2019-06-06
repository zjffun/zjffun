// Import External Dependencies
import React from 'react';

import { Blog, BGM } from './components';

import './GlassTile.scss';

const GlassTile = () => (
  <div className="glass-tile-container">
    <ul className="glass-tile">
      <li className="tile blog">
        <Blog />
      </li>
      <li className="tile music">
        <BGM />
      </li>
      <li className="tile motto">
        <h2 className="tile-title">句子</h2>
      </li>
      <li className="tile tool1">
        <h2 className="tile-title">在线工具1</h2>
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
