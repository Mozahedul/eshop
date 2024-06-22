import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/checkoutWizard';
import Layout from '../components/Layout';
import styles from '../styles/account.module.css';
import { useStateValue } from '../utils/contextAPI/StateProvider';

const Shipping = () => {
  const router = useRouter();
  const [state, dispatch] = useStateValue();
  const { userInfo } = state;

  const {
    cart: { shippingAddress },
  } = state;

  console.log('SHIPPING ADDRESS from shipping page ==> ', shippingAddress);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  // handle shipping function
  const shippingSubmitHandler = data => {
    // console.log('DATA FROM SUBMIT HANDLER ==> ', data);

    const { fullName, address, city, postalCode, country } = data;

    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    const expiresInOneHour = 1 / 24;
    Cookies.set(
      'shippingAddress',
      JSON.stringify({ fullName, address, city, postalCode, country }),
      {
        sameSite: 'none',
        secure: true,
        expires: expiresInOneHour,
      }
    );

    router.push('/payment');
  };

  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    if (!userInfo) {
      router.push('/login?redirect=shipping');
    } else {
      // console.log(shippingAddress);
      const shippingAddressFromCookie = Cookies.get('shippingAddress')
        ? JSON.parse(Cookies.get('shippingAddress'))
        : '';
      const { fullName, address, city, postalCode, country } =
        shippingAddressFromCookie;

      setValue('fullName', fullName);
      setValue('address', address);
      setValue('city', city);
      setValue('postalCode', postalCode);
      setValue('country', country);
    }
    // }
    // return () => {
    //   isCancelled.current = true;
    // };
  }, [router, userInfo, setValue]);

  return (
    <Layout title="Shipping Address" description="Shipping address of a user">
      <CheckoutWizard activeStep={1} />
      <Typography variant="h1" component="h1" textAlign="center">
        Shipping Address
      </Typography>
      <Paper className={styles.formLogin}>
        <Box
          component="form"
          onSubmit={handleSubmit(shippingSubmitHandler)}
          autoComplete="off"
          noValidate
        >
          <List>
            <ListItem>
              <TextField
                {...register('fullName', {
                  required: true,
                  minLength: 8,
                  maxLength: 24,
                })}
                label="Full Name"
                name="fullName"
                fullWidth
                size="small"
                placeholder="John Doe"
                inputProps={{ type: 'text' }}
                variant="outlined"
                helperText={
                  errors.fullName?.type === 'required'
                    ? 'Please enter your full name'
                    : '' || errors.fullName?.type === 'minLength'
                    ? 'Please enter at least 8 characters'
                    : '' || errors.fullName?.type === 'maxLength'
                    ? "Please don't exceed 24 characters"
                    : ''
                }
              />
            </ListItem>
            <ListItem>
              <TextField
                {...register('address', {
                  required: true,
                  minLength: 8,
                  maxLength: 24,
                })}
                label="Address"
                name="address"
                fullWidth
                size="small"
                placeholder="John Doe"
                inputProps={{ type: 'text' }}
                variant="outlined"
                helperText={
                  errors.address?.type === 'required'
                    ? 'Please enter your address'
                    : '' || errors.address?.type === 'minLength'
                    ? 'Please enter at least 8 characters'
                    : '' || errors.address?.type === 'maxLength'
                    ? "Please don't exceed 24 characters"
                    : ''
                }
              />
            </ListItem>
            <ListItem>
              <TextField
                {...register('city', {
                  required: true,
                  minLength: 2,
                  maxLength: 24,
                })}
                label="City"
                name="city"
                fullWidth
                size="small"
                placeholder="John Doe"
                inputProps={{ type: 'text' }}
                variant="outlined"
                helperText={
                  errors.city?.type === 'required'
                    ? 'Please enter your full name'
                    : '' || errors.city?.type === 'minLength'
                    ? 'Please enter at least 2 characters'
                    : '' || errors.city?.type === 'maxLength'
                    ? "Please don't exceed 24 characters"
                    : ''
                }
              />
            </ListItem>

            <ListItem>
              <TextField
                {...register('postalCode', {
                  required: true,
                  minLength: 3,
                  maxLength: 24,
                })}
                label="Postal Code"
                name="postalCode"
                fullWidth
                size="small"
                placeholder="John Doe"
                inputProps={{ type: 'text' }}
                variant="outlined"
                helperText={
                  errors.postalCode?.type === 'required'
                    ? 'Please enter your postal code'
                    : '' || errors.postalCode?.type === 'minLength'
                    ? 'Please enter at least 3 characters'
                    : '' || errors.postalCode?.type === 'maxLength'
                    ? "Please don't exceed 24 characters"
                    : ''
                }
              />
            </ListItem>
            <ListItem>
              <TextField
                {...register('country', {
                  required: true,
                  minLength: 2,
                  maxLength: 24,
                })}
                label="Country"
                name="country"
                fullWidth
                size="small"
                placeholder="John Doe"
                inputProps={{ type: 'text' }}
                variant="outlined"
                helperText={
                  errors.country?.type === 'required'
                    ? 'Please enter your country'
                    : '' || errors.country?.type === 'minLength'
                    ? 'Please enter at least 2 characters'
                    : '' || errors.country?.type === 'maxLength'
                    ? "Please don't exceed 24 characters"
                    : ''
                }
              />
            </ListItem>
            <ListItem>
              <Button type="submit" variant="contained" fullWidth>
                Continue
              </Button>
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Layout>
  );
};

export default Shipping;
