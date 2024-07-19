import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 64px)', // Adjusting for Navbar height
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: theme.spacing(3),
    backgroundColor: 'white',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#007BFF',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  link: {
    marginTop: theme.spacing(1),
    textDecoration: 'none',
    color: '#007BFF',
  },
  googleButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#db4437',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c23321',
    },
  },
}));

function LoginPage() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <>
      <Navbar />
      <div className={classes.root}>
        <div className={classes.container}>
          <h2 className={classes.title}>Login</h2>
          <form onSubmit={handleLogin}>
            <TextField
              className={classes.input}
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              className={classes.input}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              fullWidth
            >
              Login
            </Button>
          </form>
          <p>
            Don't have an account? <Link className={classes.link} to="/signup">Signup</Link>
          </p>
          <Button
            className={classes.googleButton}
            variant="contained"
            fullWidth
          >
            Login with Google
          </Button>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
