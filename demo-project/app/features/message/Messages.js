// @flow
import React from 'react';
import Snackbar from 'material-ui/Snackbar/index';
import { connect } from 'react-redux';
import type { MessageState as MessagesProps } from './action';
import type { State } from '../../reducers/index';

type MessagesState = {
  shown?: boolean
};

class Messages extends React.Component<MessagesProps, MessagesState> {
  constructor(props: MessagesProps) {
    super(props);
    this.state = {
      shown: !!props.message
    };
  }

  componentWillReceiveProps(nextProps: MessagesProps) {
    if (this.props.timestamp !== nextProps.timestamp) {
      this.setState({
        shown: true
      });
    }
  }

  handleClose() {
    this.setState({
      shown: false
    });
  }

  render() {
    return (
      <Snackbar
        open={this.state.shown}
        autoHideDuration={4000}
        {...this.props}
        onRequestClose={this.handleClose.bind(this)}
      />
    );
  }
}

function mapState(state: State): MessagesProps {
  return {
    ...state.messages
  };
}

export default connect(mapState)(Messages);
