// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button/index';
import ActionFlightTakeoff from 'material-ui-icons/FlightTakeoff';
import styles from './Home.css';

export default class Home extends Component<{}> {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <p>Home aaa bb a</p>
          <Link to="/counter">
            <Button
              raised
              color="primary"
            >
              <ActionFlightTakeoff />
              to Counter
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
