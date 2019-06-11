// Import External Dependencies
import React from 'react';

import './Sentence.scss';

import sentences from '@/sentences/rewrite.json';

class Sentence extends React.Component {
  state = {
    sentence: {},
    progress: 0
  };

  constructor(props) {
    super(props);
    this.nowRef = React.createRef();
  }

  componentDidMount() {
    const _this = this;
    const nowDom = this.nowRef.current;
    let progress = 0;
    this.randomPickSentences();
    function start() {
      if (progress < 100) {
        progress += 0.1;
        nowDom.style.width = progress + '%';
      } else {
        _this.randomPickSentences();
        progress = 0;
        nowDom.style.width = progress + '%';
      }
      requestAnimationFrame(start);
    }
    requestAnimationFrame(start);
  }

  randomPickSentences = () => {
    this.setState({
      sentence: sentences[Math.floor(Math.random() * sentences.length)]
    });
  };

  render() {
    const {
      sentence: { content, writer },
      progress
    } = this.state;
    return (
      <div className="sentence">
        <div className="sentence__content">{content}</div>
        <div className="sentence__writer"> —— {writer} 《Rewrite》</div>
        <div className="sentence__progress">
          <div className="now" ref={this.nowRef} />
        </div>
      </div>
    );
  }
}

export default Sentence;
