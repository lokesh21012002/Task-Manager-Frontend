import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link ,useLocation} from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import {toast,ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { localeCurrency } from '@progress/kendo-intl';

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
  activeNavButton: {
    backgroundColor: 'white',
    color: '#007BFF',
  },
  activeNavButtonLogout: {
    backgroundColor: 'red',
    color: 'white',
  },
}));

function Navbar() {
    const location=useLocation();


    const [login,setLoggedin]=useState(true);
  const classes = useStyles();
  const loginCheck=()=>{
    setLoggedin(false);


  }
  const logoutCheck=()=>{
    setLoggedin(true);
  }
  const handleLogout=()=>{
    toast.success("Good Bye!!!");

    // localStorage.removeItem('token');
  }

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
          {

            location.pathname==="/login" || location.pathname==='/signup' ||location.pathname==='/'?
            <>
          <Link to="/" className={classes.linkButton}>
            <Button   className={`${classes.navButton} ${location.pathname === '/' ? classes.activeNavButton : ''}`}
                    color="inherit"  >Login</Button>
          </Link>
          
          <Link to="/signup" className={classes.linkButton}>
            <Button  className={`${classes.navButton} ${location.pathname === '/signup' ? classes.activeNavButton : ''}`} color="inherit">Signup</Button>
          </Link>
          </>
          :
        
            
           <Link to="/">
            <ToastContainer/>
            <Button className={classes.activeNavButtonLogout } color="inherit" onClick={handleLogout}>Logout</Button>
          </Link>
        }

        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
