import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/checkoutWizard';
import Layout from '../components/Layout';
import styles from '../styles/account.module.css';
import { useStateValue } from '../utils/contextAPI/StateProvider';

const Payment = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [state, dispatch] = useStateValue();

  const {
    cart: { shippingAddress },
  } = state;

  console.log('PAYMENT PAGE ==> ', shippingAddress);

  useEffect(() => {
    if (!shippingAddress && !shippingAddress.address) {
      router.push('/shipping');
    } else {
      const cookiePaymentMethod = Cookies.get('paymentMethod')
        ? JSON.parse(Cookies.get('paymentMethod'))
        : '';
      setPaymentMethod(cookiePaymentMethod);
    }
  }, [router, shippingAddress]);

  const submitHandler = event => {
    event?.preventDefault();
    if (!paymentMethod) {
      toast.error('Payment method is required!', {
        position: 'top-center',
        theme: 'colored',
        autoClose: 2000,
        draggable: true,
      });
    } else {
      dispatch({
        type: 'SAVE_PAYMENT_METHOD',
        payload: paymentMethod,
      });
      const expiresInOneHour = 1 / 24;
      Cookies.set('paymentMethod', JSON.stringify(paymentMethod), {
        sameSite: 'none',
        secure: true,
        expires: expiresInOneHour,
      });
      router.push('/placeorder');
    }
  };
  return (
    <Layout
      title="Payment page"
      description="Payment page with stripe, paypal, and cash"
    >
      <CheckoutWizard activeStep={2} />
      <Typography variant="h1" component="h1" textAlign="center">
        Payment Method
      </Typography>
      <Paper className={styles.formLogin}>
        <Box component="form" onSubmit={submitHandler}>
          <List>
            <ListItem>
              <FormControl>
                <RadioGroup
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={event => setPaymentMethod(event.target.value)}
                >
                  <FormControlLabel
                    label="PayPal"
                    value="PayPal"
                    control={<Radio />}
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl>
                <RadioGroup
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={event => setPaymentMethod(event.target.value)}
                >
                  <FormControlLabel
                    label="Stripe"
                    value="Stripe"
                    control={<Radio />}
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl>
                <RadioGroup
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={event => setPaymentMethod(event.target.value)}
                >
                  <FormControlLabel
                    label="Cash"
                    value="Cash"
                    control={<Radio />}
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>
            <ListItem>
              <Button type="submit" variant="contained" fullWidth>
                Continue
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => router.push('/shipping')}
                type="button"
                fullWidth
              >
                Back
              </Button>
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Layout>
  );
};

export default Payment;
