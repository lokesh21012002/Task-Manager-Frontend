import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link ,useLocation} from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import {toast,ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { localeCurrency } from '@progress/kendo-intl';
import { useAuth } from '../context/AuthContext';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    margin:'auto',
    textAlign:"center",
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
   toolbar: {
    display: 'flex',
    justifyContent: 'space-between', // Ensures the button stays at the end
    alignItems:"center",
  },
}));

function Navbar() {
  const { logout } = useAuth();

    const location=useLocation();


    // const [login,setLoggedin]=useState(true);
  const classes = useStyles();
  // const loginCheck=()=>{
  //   setLoggedin(false);


  // }
  // const logoutCheck=()=>{
  //   setLoggedin(true);
  // }
  const handleLogout=()=>{
    toast.success("Good Bye!!!");
    logout();


    // localStorage.removeItem('token');
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            Task Manager
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
