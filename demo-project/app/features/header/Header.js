// @flow
import React from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  withStyles
} from 'material-ui';
import MenuIcon from 'material-ui-icons/Menu';

import UserMenu from './UserMenu';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

type HeaderProps = {
  classes: any
};

class Header extends React.Component<HeaderProps> {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.flex} type="title" color="inherit">
              CFD软件可信度分析工具
            </Typography>
            <UserMenu />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
