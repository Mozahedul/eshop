import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import styles from '../styles/account.module.css';
import { useStateValue } from '../utils/contextAPI/StateProvider';
import { getError } from '../utils/error';

const Login = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, dispatch] = useStateValue();
  const [showPassword, setShowPassword] = useState(false);
  // const [hidePassword, setHidePassword] = useState(false);

  const [error, setError] = useState(null);

  // react hook form
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // console.log('ROUTER IN LOGIN PAGE ==> ', router);

  const { userInfo } = state;

  const submitHandler = async () => {
    // event.preventDefault();

    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });

      if (data) {
        dispatch({
          type: 'USER_LOGIN',
          payload: data,
        });
        // cookie expires in one hour
        // const expiresInOneHour = 1 / 24;
        const expiresInOneHour = 24;
        Cookies.set('userInfo', JSON.stringify(data), {
          sameSite: 'none',
          secure: true,
          expires: expiresInOneHour,
        });

        // If search routing contains router query like "/login?redirect=shipping"
        if (redirect) {
          router?.push(redirect);
        } else {
          // If search routing not contain any routing query
          router?.back();
        }
      }
    } catch (err) {
      setError(getError(err));
    }
  };

  // show password handle function
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Hide password handle
  const handleHidePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (userInfo) router.push(redirect || '/');
  }, [redirect, router, userInfo]);

  return (
    <Layout title="Login Page" description="Login page to authenticate user">
      <Typography variant="h1" component="h1" textAlign="center">
        <Link href="/">Next Amazon</Link>
      </Typography>
      <Paper className={styles.formLogin}>
        <Typography
          variant="h2"
          component="h2"
          sx={{ padding: '15px 0 0 15px' }}
        >
          User Login
        </Typography>
        {error ? (
          <Alert severity="error" sx={{ margin: '0 15px 10px' }}>
            {error}
          </Alert>
        ) : (
          ''
        )}
        <Box
          component="form"
          onSubmit={handleSubmit(submitHandler)}
          autoComplete="off"
          noValidate
        >
          <List>
            <ListItem>
              <TextField
                {...register('email', {
                  required: true,
                  pattern: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/,
                })}
                inputProps={{ type: 'email' }}
                fullWidth
                label="Email"
                variant="outlined"
                id="email"
                onChange={event => setEmail(event.target.value)}
                helperText={
                  (errors.email?.type === 'required' &&
                    'Please enter an email address.') ||
                  (errors.email?.type === 'pattern' &&
                    'Please insert correct email format.')
                }
              />
            </ListItem>
            <ListItem>
              <TextField
                {...register('password', { required: true, minLength: 6 })}
                InputProps={{
                  type: showPassword ? 'text' : 'password',
                  endAdornment: (
                    <InputAdornment position="end">
                      {showPassword ? (
                        <IconButton edge="end" onClick={handleHidePassword}>
                          <VisibilityOffSharpIcon />
                        </IconButton>
                      ) : (
                        <IconButton edge="end" onClick={handleShowPassword}>
                          <VisibilitySharpIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                id="password"
                variant="outlined"
                label="Password"
                fullWidth
                onChange={event => setPassword(event.target.value)}
                helperText={
                  (errors.password?.type === 'required' &&
                    'Password is required!') ||
                  (errors.password?.type === 'minLength' &&
                    'Please insert at least 6 characters')
                }
              />
            </ListItem>
            <ListItem>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                By continuing, you agree to Next Amazon's Conditions of Use and
                Privacy Notice.
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="caption">
                Don't have account yet?{' '}
              </Typography>
            </ListItem>
            <ListItem>
              <Link
                href={`/register?redirect=${redirect || '/'}`}
                style={{ width: '100%' }}
              >
                <Button variant="outlined" color="success" fullWidth>
                  Create an account
                </Button>
              </Link>
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Layout>
  );
};

export default Login;
