import { Overlay } from 'components/Overlay/Overley.staled';
import React, { Component } from 'react';

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.keyPress);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyPress);
  }

  keyPress = event => {
    if (event.key === 'Escape') {
      this.props.onClose('');
    }
  };
  onOverley = event => {
    if (event.target === event.currentTarget) {
      this.props.onClose('');
    }
  };
  render() {
    return (
      <Overlay onClick={this.onOverley}>
        <img width="70%" alt="modalImg" src={this.props.src} />
      </Overlay>
    );
  }
}
