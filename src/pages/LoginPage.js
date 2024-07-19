import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link ,useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import { axiosInstance } from "../config/AxiosConfig";
import {toast,ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
});

function LoginPage() {
  const classes = useStyles();
  const navigate=useNavigate();
  const { login } = useAuth();




  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin =  async (data,e) => {
        e.preventDefault();

        
        try{
            const res=await axiosInstance.post("/users/login",data);
            console.log(res);
            if(res.status===200){

              login();
          
              localStorage.setItem("token",res.data.token);
              console.log(localStorage.getItem('token'));
              toast.success("Login Sucess")
              setTimeout(()=>{
                  navigate("/home");
              },1000)
              // navigate('/home');
              

              
            }
      
       
        }
        catch(error){
            navigate('/')
            toast.error(error.response.data.message);

            // console.log(error.response.data.emailnotfound);

        }

    
    // Handle login logic here
  };

  return (
    <>
    <ToastContainer/>
      <Navbar />
      <div className={classes.root}>
        <div className={classes.container}>
          <h2 className={classes.title}>Login</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            <TextField
              className={classes.input}
              label="Email"
              variant="outlined"
              fullWidth
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
            <TextField
              className={classes.input}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
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
          {/* <Button
            className={classes.googleButton}
            variant="contained"
            fullWidth
          >
            Login with Google
          </Button> */}
        </div>
      </div>
    </>
  );
}

export default LoginPage;
