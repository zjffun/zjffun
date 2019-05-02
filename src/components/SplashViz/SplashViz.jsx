// Import External Dependencies
import React from 'react';
import tree from './tree';

import './SplashViz.scss';

export default class SplashViz extends React.Component {
  constructor() {
      super();
      this.canvas = React.createRef();
  }

  componentDidMount() {
    let canvas = this.canvas.current,
    width = document.body.clientWidth;
    canvas.width = width;
    // canvas.height = width;
    canvas.height = Math.floor(width / 20 * 9);
    tree(this.canvas.current);
  }

  render() {
    return (
      <section className="splash-viz">
        <canvas ref={this.canvas}/>
      </section>
    );
  }
}
