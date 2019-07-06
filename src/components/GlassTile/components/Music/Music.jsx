// Import External Dependencies
import React from 'react';

import animeMusic from './anime-music';
import './Music.scss';

import MusicList from './list.json';

const BASIC_URL = 'http://music.zjffun.com/';

class Music extends React.Component {
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
    const fname = MusicList[0];

    this.setState({
      name: fname.substring(0, fname.lastIndexOf('.'))
    });

    animeMusic.onProgress = function(per, now, all) {
      //监听播放进度事件,返回的依次为播放百分比（Number）， 当前播放时间（MM:SS），总长度（MM:SS）
      _this.setState({
        progress: per,
        time: `${now}/${all}`
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

    animeMusic.Next(`${BASIC_URL}旅.ogg`);
  }

  handlePlay = () => {
    this.state.isPlaying ? animeMusic.Pause() : animeMusic.Play();
  };

  handleNext = () => {
    const fname = MusicList[Math.floor(Math.random() * MusicList.length)];
    this.setState({
      name: fname.substring(0, fname.lastIndexOf('.'))
    });
    animeMusic.Next(`${BASIC_URL}${fname}`);
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

export default Music;
