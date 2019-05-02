// Import External Dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { BrowserRouter as AnalyticsRouter } from 'react-g-analytics';

// Import Components
import Site from './components/Site/Site';

// Import helpers

const Router = process.env.NODE_ENV === 'production' ? AnalyticsRouter : BrowserRouter;
const render = process.env.NODE_ENV === 'production' ? ReactDOM.hydrate : ReactDOM.render;

// Client Side Rendering
render((
  <Router id="UA-XXXXXXXX-X">
    <Route
      path="/"
      render={ props => (
        <Site
          { ...props }
          // import={ path => import(`./content/${path}`) }
          />
      )} />
  </Router>
), document.getElementById('root'));