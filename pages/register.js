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
import showErrorPasswordMessage from '../utils/functions/errorMsgPassword';

const Register = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, dispatch] = useStateValue();

  const [extractEmail, setExtractEmail] = useState(false);
  const [upperLowerCase, setUpperLowerCase] = useState(false);
  const [specialChar, setSpecialChar] = useState(null);
  const [passwordNumber, setPasswordNumber] = useState(false);
  const [confirmPassMsg, setConfirmPassMsg] = useState('');

  const [error, setError] = useState(null);

  // password show and hide state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // console.log('PASSWORD ==> ', password);
  // console.log('SPECIAL ==> ', specialChar);

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { userInfo } = state;

  // Password related settings
  const setPasswordHandle = event => {
    setPassword(event.target.value);
    // for password confirmation
    if (event.target.value.length > 0 && confirmPassword.length > 0) {
      if (event.target.value !== confirmPassword) {
        setConfirmPassMsg("Password don't match");
      } else {
        setConfirmPassMsg('Password matched');
      }
    }

    // for uppercase and lowercase checking
    const regexpCase = new RegExp(/(?=.*[A-Z])(?=.*[a-z])/, 'g');
    const matchedReg = regexpCase.test(event.target.value);
    setUpperLowerCase(matchedReg);

    // for matching email and password
    const matchedEmailPassword = email === event.target.value;
    setExtractEmail(matchedEmailPassword);

    // for checking special characters in password
    const regexSpecial = new RegExp(/[^a-zA-Z0-9]/);
    const strSpecial = event.target.value;
    const matchedChar = regexSpecial.test(strSpecial);
    setSpecialChar(matchedChar);

    // for checking numbers in password
    const regexNumber = new RegExp(/(?=.*[0-9])/, 'g');
    const matchedNumber = regexNumber.test(event.target.value);
    setPasswordNumber(matchedNumber);
  };

  const confirmPasswordHandle = event => {
    setConfirmPassword(event.target.value);
    if (event.target.value.length > 0 && password.length > 0) {
      if (event.target.value !== password) {
        setConfirmPassMsg("Password don't match");
      } else {
        setConfirmPassMsg('Password matched');
      }
    }
  };

  // Register submit handler
  const RegisterSubmitHandler = async () => {
    // event.preventDefault();
    if (password !== confirmPassword) {
      setConfirmPassMsg(`Passwords don't match`);
      return;
    }

    if (password === email) {
      return;
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });

      // console.log('DATA TYPE CHECK ==> ', data.message);

      if (data.message) {
        setError(data.message);
        return;
      }

      if (data && !data.message) {
        dispatch({
          type: 'USER_LOGIN',
          payload: data,
        });
        const expiresInOneHour = 1 / 24;
        Cookies.set('userInfo', JSON.stringify(data), {
          sameSite: 'none',
          secure: true,
          expires: expiresInOneHour,
        });

        if (redirect) {
          router?.push(redirect);
        } else {
          router?.back();
        }
      }
    } catch (err) {
      setError(getError(err));
    }
  };

  // handle password show
  const handlePasswordShow = () => {
    // console.log(showPassword);
    setShowPassword(!showPassword);
  };

  // handle password hide
  const handlePasswordHide = () => {
    setShowPassword(!showPassword);
  };

  // handle password confirm handle to show
  const showPasswordConfirmHandle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // handle password confirm handle to hide
  const hidePasswordConfirmHandle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // redirect user from register page to home page if user already logged in
  useEffect(() => {
    if (userInfo) router.push(redirect || '/');
  }, [redirect, router, userInfo]);

  return (
    <Layout title="User Register" description="Register page for user">
      <Typography variant="h1" component="h1" textAlign="center">
        <Link href="/">Next Amazon</Link>
      </Typography>
      <Paper className={styles.formLogin}>
        <Typography
          variant="h2"
          component="h2"
          sx={{ padding: '15px 0 0 15px' }}
        >
          User Register
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
          onSubmit={handleSubmit(RegisterSubmitHandler)}
          autoComplete="off"
          noValidate
        >
          <List>
            <ListItem>
              <TextField
                {...register('name', {
                  required: true,
                  minLength: 8,
                  maxLength: 24,
                })}
                helperText={
                  errors.name?.type === 'required'
                    ? 'Please insert full name.'
                    : '' || errors.name?.type === 'minLength'
                    ? 'Please Insert at least 8 characters.'
                    : '' || errors.name?.type === 'maxLength'
                    ? `Please don't exceed 24 characters.`
                    : ''
                }
                inputProps={{ type: 'text' }}
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
                placeholder="John Doe"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </ListItem>
            <ListItem>
              <TextField
                {...register('email', {
                  required: true,
                  pattern: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/,
                })}
                helperText={
                  errors.email?.type === 'required'
                    ? 'Please enter an email address.'
                    : '' || errors.email?.type === 'pattern'
                    ? `That's an invalid email.`
                    : ''
                }
                inputProps={{ type: 'email' }}
                fullWidth
                label="Email"
                variant="outlined"
                size="small"
                placeholder="xxx@example.com"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </ListItem>
            <ListItem>
              <TextField
                {...register('password', {
                  required: true,
                  pattern: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
                  minLength: 8,
                  maxLength: 24,
                })}
                InputProps={{
                  type: showPassword ? 'text' : 'password',
                  endAdornment: (
                    <InputAdornment position="end">
                      {showPassword ? (
                        <IconButton edge="end" onClick={handlePasswordHide}>
                          <VisibilityOffSharpIcon />
                        </IconButton>
                      ) : (
                        <IconButton edge="end" onClick={handlePasswordShow}>
                          <VisibilitySharpIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                fullWidth
                label="Password"
                variant="outlined"
                size="small"
                placeholder="*******"
                value={password}
                onChange={setPasswordHandle}
              />
            </ListItem>
            {password.length > 0
              ? showErrorPasswordMessage(
                  extractEmail,
                  upperLowerCase,
                  passwordNumber,
                  specialChar,
                  password
                )
              : ''}
            <ListItem>
              <TextField
                InputProps={{
                  type: showConfirmPassword ? 'text' : 'password',
                  endAdornment: (
                    <InputAdornment position="end">
                      {showConfirmPassword ? (
                        <IconButton
                          edge="end"
                          onClick={hidePasswordConfirmHandle}
                        >
                          <VisibilityOffSharpIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          edge="end"
                          onClick={showPasswordConfirmHandle}
                        >
                          <VisibilitySharpIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                fullWidth
                label="Confirm Password"
                variant="outlined"
                size="small"
                placeholder="*******"
                value={confirmPassword}
                helperText={confirmPassMsg}
                onChange={confirmPasswordHandle}
              />
            </ListItem>
            <ListItem>
              <Button type="submit" variant="contained" fullWidth>
                Register
              </Button>
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">
                By creating an account, you agree to Next Amazon's Conditions of
                Use and Privacy Notice.
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="caption">
                Already have an account?
              </Typography>
            </ListItem>
            <ListItem>
              <Link
                href={`/login?redirect=${redirect || '/'}`}
                style={{ width: '100%' }}
              >
                <Button variant="outlined" color="secondary" fullWidth>
                  Login
                </Button>
              </Link>
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Layout>
  );
};

export default Register;
