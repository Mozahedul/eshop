import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useStateValue } from '../utils/contextAPI/StateProvider';
import { getError } from '../utils/error';

const Profile = () => {
  const [{ userInfo }, dispatch] = useStateValue();
  const [passwordMsg, setPasswordMsg] = useState('');
  const [confirmPasswordMsg, setConfirmPasswordMsg] = useState('');
  const router = useRouter();

  console.log(passwordMsg, confirmPasswordMsg);

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setValue,
  } = useForm();

  // Profile from submit handler function
  const profileSubmitHandle = async userData => {
    const { name, email, password } = userData;

    // Check password and confirm password matching
    if (passwordMsg !== confirmPasswordMsg) {
      toast.error('Passwords do not match', {
        position: 'top-center',
        pauseOnHover: true,
        autoClose: 2000,
        theme: 'colored',
      });
      return;
    }

    // match password with regular expression for pattern checking
    // like uppercase, lowercase, and number or special characters
    const regex = new RegExp(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/, 'g');
    const matchedPassword = regex.test(passwordMsg);

    if (passwordMsg !== '' && confirmPasswordMsg !== '' && !matchedPassword) {
      toast.error(
        'Passwords should contain uppercase, lowercase, & a number/special character',
        {
          position: 'top-center',
          theme: 'colored',
          pauseOnHover: true,
        }
      );
      return;
    }

    try {
      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      const expiresInOneHour = 1 / 24;
      Cookies.set('userInfo', JSON.stringify(data), {
        sameSite: 'none',
        secure: true,
        expires: expiresInOneHour,
      });
      toast.success('Profile updated successfully', {
        position: 'top-center',
        theme: 'colored',
      });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const subscription = watch(data => {
      const { password, confirmPassword } = data;
      setPasswordMsg(password);
      setConfirmPasswordMsg(confirmPassword);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    if (!userInfo) {
      router.push('/login');
      return true;
    }

    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
    // }
    // return () => {
    //   isCancelled.current = true;
    // };
    return true;
  }, [userInfo, router, setValue]);

  return (
    <Layout title="Profile" description="Profile page for update">
      <Grid container spacing={4} marginTop="30px">
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <Link href="/profile">
                <ListItem selected button>
                  <ListItemText primary="User Profile" />
                </ListItem>
              </Link>
              <Link href="/order-history">
                <ListItem button>
                  <ListItemText primary="Order History" />
                </ListItem>
              </Link>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Typography variant="h2">User Profile</Typography>
              </ListItem>

              <Box
                component="form"
                onSubmit={handleSubmit(profileSubmitHandle)}
                autoComplete="off"
                noValidate
              >
                <ListItem>
                  <TextField
                    {...register('name', {
                      required: true,
                      minLength: 8,
                      maxLength: 24,
                    })}
                    fullWidth
                    name="name"
                    placeholder="John Doe"
                    inputProps={{ type: 'text' }}
                    label="Name"
                    size="small"
                    variant="outlined"
                    helperText={
                      errors.name?.type === 'required'
                        ? 'Enter full name'
                        : errors.name?.type === 'minLength'
                        ? 'Enter at least 8 characters'
                        : errors.name?.type === 'maxLength'
                        ? "Don't exceed 24 characters"
                        : ''
                    }
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    {...register('email', {
                      required: true,
                      pattern:
                        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/,
                    })}
                    fullWidth
                    placeholder="john@mail.com"
                    label="Email"
                    name="email"
                    variant="outlined"
                    inputProps={{ type: 'email' }}
                    size="small"
                    helperText={
                      errors.email?.type === 'required'
                        ? 'Email address should not be empty'
                        : errors.email?.type === 'pattern'
                        ? 'Invalid email address'
                        : ''
                    }
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    {...register('password', {
                      // pattern: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
                      validate: value => value === '' || value.length > 7,
                    })}
                    fullWidth
                    label="Password"
                    name="password"
                    size="small"
                    variant="outlined"
                    placeholder="********"
                    inputProps={{ type: 'password' }}
                    helperText={
                      errors.password
                        ? 'Password should be at least 8 characters'
                        : ''
                    }
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    {...register('confirmPassword', {
                      // pattern: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
                      validate: value => value === '' || value.length > 7,
                    })}
                    fullWidth
                    inputProps={{ type: 'password' }}
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    size="small"
                    placeholder="********"
                    helperText={
                      errors.confirmPassword
                        ? 'Confirm password must be at least 8 chars'
                        : ''
                    }
                  />
                </ListItem>

                <ListItem>
                  <Button fullWidth variant="contained" type="submit">
                    Update
                  </Button>
                </ListItem>
              </Box>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;
