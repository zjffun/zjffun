// Import External Dependencies
import React from 'react';

import animeMusic from './anime-music';
import './BGM.scss';

class Blog extends React.Component {
  state = {
    name: '',
    time: '00:00/00:00',
    isPlaying: false,
    progress: '0'
  };

  constructor(props) {
    super(props);
    this.progressRef = React.createRef();
  }

  componentDidMount() {
    const _this = this;
    animeMusic.onProgress = function(per, now, all) {
      //监听播放进度事件,返回的依次为播放百分比（Number）， 当前播放时间（MM:SS），总长度（MM:SS）
      _this.setState({
        progress: per,
        time: `${now}/${all}`
      });
    };

    animeMusic.onLoaded = function(res) {
      _this.setState({
        name: res.title
      });
    };

    animeMusic.onPlay = function() {
      _this.setState({
        isPlaying: true
      });
    };

    animeMusic.onPause = function() {
      _this.setState({
        isPlaying: false
      });
    };

    animeMusic.bindPlayTo(this.progressRef.current);

    animeMusic.Next();
  }

  handlePlay = () => {
    this.state.isPlaying ? animeMusic.Pause() : animeMusic.Play();
  };

  handleNext = () => {
    animeMusic.Next();
  };

  render() {
    const { name, time, isPlaying, progress } = this.state;
    return (
      <div className="player">
        <div
          onClick={this.handlePlay}
          className={`player__control ${
            isPlaying ? 'player__control--pause' : 'player__control--play'
          }`}
        />
        <div onClick={this.handleNext} className="player__next" />
        <div className="player__name">{name}</div>
        <div className="player__time">{time}</div>
        <div className="player__progress" ref={this.progressRef}>
          <div className="now" style={{ width: progress + '%' }} />
        </div>
      </div>
    );
  }
}

export default Blog;
