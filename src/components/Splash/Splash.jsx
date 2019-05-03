// Import External Dependencies
import React from 'react';

// Import Components
import SplashViz from '../SplashViz/SplashViz';
import GlassTile from '../GlassTile/GlassTile';

// Load Styling
import './Splash.scss';

const Splash = () => (
  <div className="splash">
    <SplashViz />

    <div className="splash__section splash__section--dusk page__content">
      <GlassTile />
    </div>

  </div>
);

export default Splash;
