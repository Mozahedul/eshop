import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/checkoutWizard';
import Layout from '../components/Layout';
import { useStateValue } from '../utils/contextAPI/StateProvider';
import { getError } from '../utils/error';

const PlaceOrder = () => {
  const [state, dispatch] = useStateValue();
  const [shipAddress, setShipAddress] = useState({});
  const [paymentMeth, setPaymentMeth] = useState('');
  const [shoppingCartItems, setShoppingCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // console.log('SHOPPING CART ==> ', shoppingCartItems);

  const { userInfo } = state;

  // Tax count of cart items
  const itemsPrice = shoppingCartItems.reduce((acc, curr) => {
    return acc + curr.quantity * curr.price;
  }, 0);

  // Tax count from cart items
  const taxCounter = ((itemsPrice * 15) / 100).toFixed(2);
  // console.log(taxCounter);

  // calculation of shipping price from cart items
  const shippingPriceCount = itemsPrice > 200 ? 0 : 15;

  // calculate the total price of the cart items
  const totalProductPrice = (
    Number(itemsPrice) +
    Number(taxCounter) +
    Number(shippingPriceCount)
  ).toFixed(2);

  // Place order handle function
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      // for sending data to database
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: shoppingCartItems,
          shippingAddress: shipAddress,
          paymentMethod: paymentMeth,
          itemPrice: itemsPrice.toFixed(2),
          taxPrice: taxCounter,
          shippingPrice: shippingPriceCount,
          totalPrice: totalProductPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // console.log('DATA', data);

      // Remove cart items from Global state
      dispatch({
        type: 'CART_CLEAR',
        payload: [],
      });

      // Remove cart items from local storage
      localStorage.getItem('cartItems') && localStorage.removeItem('cartItems');
      Cookies.get('shippingAddress') && Cookies.remove('shippingAddress');
      Cookies.get('paymentMethod') && Cookies.remove('paymentMethod');

      setLoading(false);

      // If we submit data to database, then we will redirect to order/id page
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      // show error message with toast-reactify NPM package
      toast.error(getError(err), {
        position: 'top-center',
        theme: 'colored',
        autoClose: 2000,
        pauseOnHover: true,
      });
    }
  };

  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    if (!userInfo) {
      router.push('/login');
    }

    // for fetching shipping address from cookie
    const shipAddrCookie = Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {};
    setShipAddress(shipAddrCookie);

    // for fetching payment method from cookie
    const paymentMethCookie = Cookies.get('paymentMethod')
      ? JSON.parse(Cookies.get('paymentMethod'))
      : '';
    setPaymentMeth(paymentMethCookie);

    // for fetching cart items from local storage
    const cartItemCookie = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];

    // console.log('CART ITEM COOKIES --> ', cartItemCookie);

    setShoppingCartItems(cartItemCookie);
    // }
    // return () => {
    //   isCancelled.current = true;
    // };
  }, [userInfo, paymentMeth, router]);

  useEffect(() => {
    // let isOut = false;
    // if (!isOut) {
    // if cart items, shipping address
    // payment method is absent, then we will redirect
    // to home page

    // console.log(Object.keys(shipAddress));
    // console.log(paymentMeth);
    // console.log('SHOPPING CART ITEMS ==> ', shoppingCartItems);

    if (
      Object.keys(shipAddress).length < 1 &&
      paymentMeth &&
      shoppingCartItems.length < 1
    ) {
      router.push('/');
    }
    // }
    // return () => {
    //   isOut = true;
    // };
  }, [shipAddress, paymentMeth, shoppingCartItems, router]);

  return (
    <Layout
      title="Place order page"
      description="Place order page to show shipping details, payment method, cart items, and order summary"
    >
      <CheckoutWizard activeStep={3} />
      <Typography variant="h1" sx={{ marginTop: '40px' }}>
        Place order
      </Typography>
      {Object.keys(shipAddress).length &&
      paymentMeth &&
      shoppingCartItems?.length ? (
        <Grid container spacing={2}>
          <Grid item md={9} xs={12}>
            <Card sx={{ marginBottom: '15px' }}>
              <List>
                <ListItem>
                  <Typography variant="h6">Shipping Address</Typography>
                </ListItem>
                <ListItem>
                  {shipAddress && shipAddress.address ? (
                    <Typography variant="body1">
                      <strong>{shipAddress.fullName},</strong>
                      <br />
                      {shipAddress.address}, {shipAddress.city},<br />
                      {shipAddress.postalCode}, {shipAddress.country}
                    </Typography>
                  ) : null}
                </ListItem>
              </List>
            </Card>
            <Card sx={{ marginBottom: '15px' }}>
              <List>
                <ListItem>
                  <Typography variant="h6">Payment Method</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="body1">{paymentMeth}</Typography>
                </ListItem>
              </List>
            </Card>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h6">Order Items</Typography>
                </ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shoppingCartItems?.map(item => (
                        <TableRow key={item.slug}>
                          <TableCell>
                            <Link href={`/product/${item.slug}`}>
                              <Image
                                src={item.images[0]}
                                alt={item.title}
                                width="50"
                                height="50"
                                priority
                              />
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link href={`/product/${item.slug}`}>
                              {item.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {item.quantity} X {item.price}
                          </TableCell>
                          <TableCell>
                            ${(item.quantity * item.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h6">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant="subtitle2">Items price:</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant="body2" textAlign="right">
                        ${itemsPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant="subtitle2">Tax:</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant="body2" textAlign="right">
                        ${taxCounter}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant="subtitle2">
                        Shipping Price:
                      </Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant="body2" textAlign="right">
                        ${shippingPriceCount}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <hr />
                <ListItem>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: '16px', fontWeight: 600 }}
                      >
                        Total Price:
                      </Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant="body2" textAlign="right">
                        ${totalProductPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
              <CardActions>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  size="small"
                  fullWidth
                >
                  Place Order &nbsp;
                  {loading && <CircularProgress size="1rem" color="success" />}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <List>
            <ListItem>
              <Typography>
                Shopping cart, shopping address, and payment method are empty.
                Add these, and then try to place an order{' '}
                <Button>
                  <Link href="/">Go Shopping</Link>
                </Button>
              </Typography>
            </ListItem>
          </List>
        </Card>
      )}
    </Layout>
  );
};

export default PlaceOrder;
