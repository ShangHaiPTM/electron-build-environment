import React from 'react';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import { connect } from 'react-redux';

import s from './LoadingMask.css';
import type { State } from '../../reducers/index';

type Props = {
  shown: boolean
}

class LoadingMask extends React.Component<Props> {
  render() {
    const shown = this.props.shown;
    return (
      <div>
        <div className={s.progress} style={{ display: shown ? 'block' : 'none' }}>
          <CircularProgress size={80} thickness={5} />
        </div>
      </div>
    );
  }
}

function mapState(state: State) {
  return {
    shown: state.loading.shown
  };
}

export default connect(mapState, null)(LoadingMask);
