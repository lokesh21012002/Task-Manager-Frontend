import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  linkButton: {
    textDecoration: 'none',
    color: 'inherit',
  },
   navButton: {
    color: 'white',
    '&:hover': {
      backgroundColor: 'white',
      color: '#007BFF',
    },
},
}));

function NavBarHome() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {/* Task Manager */}
          </Typography>
          <Link to="/login" className={classes.linkButton}>
            <Button  className={classes.navButton} color="inherit">Logout</Button>
          </Link>
          {/* <Link to="/signup" className={classes.linkButton}>
            <Button className={classes.navButton} color="inherit">Signup</Button>
          </Link> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBarHome;
