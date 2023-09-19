import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useStateValue } from '../utils/contextAPI/StateProvider';

const CartScreen = () => {
  const router = useRouter();
  const [state, dispatch] = useStateValue();
  const [msgState, setMsgState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { open, vertical, horizontal } = msgState;

  // catch user info from state
  const { userInfo } = state;

  // close success message
  const handleClose = () => setMsgState({ ...msgState, open: false });

  const {
    cart: { cartItems },
  } = state;

  // console.log(typeof cartItems);

  // Update Cart quantity
  const updateCartHandler = (item, quantity) => {
    dispatch({
      type: 'CART_ITEM_ADDED',
      payload: { ...item, quantity },
    });
  };

  // Remove cart items from cart page
  const removeCartHandler = item => {
    if (item) {
      dispatch({
        type: 'REMOVE_CART_ITEM',
        payload: item,
      });
      setMsgState({ ...msgState, open: true });
    }
  };

  // Get upto two decimal pointes
  const getUptoTwoDecimal = number => {
    return number?.toFixed(2);
  };

  // Handle checkout from cart page
  const checkoutHandler = () => {
    if (userInfo) {
      router.push('/shipping');
    } else {
      router.push('/login?redirect=shipping');
    }
  };

  return (
    <Layout title="Shopping cart" description="Product list of shopping cart">
      <Typography variant="h1" component="h1">
        Shopping Cart
      </Typography>
      {cartItems?.length < 1 || cartItems === undefined ? (
        <Typography>
          Your Shopping Cart is Empty. &nbsp;
          <Link href="/">
            <Button variant="contained" size="small">
              Go Shopping
            </Button>
          </Link>
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item md={9} xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems?.map(item => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`}>
                          <Image
                            src={item.images[0].replace('./public', '')}
                            alt={item.title}
                            width="50"
                            height="50"
                          />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/product/${item.slug}`}>
                          <Typography variant="body1">{item.title}</Typography>
                        </Link>
                      </TableCell>
                      <TableCell align="right">
                        <Select
                          value={item.quantity}
                          onChange={event =>
                            updateCartHandler(item, event.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map(x => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" color="secondary">
                          {`${item.quantity} X ${getUptoTwoDecimal(
                            item.price
                          )} = `}
                          ${getUptoTwoDecimal(item.price * item.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => removeCartHandler(item)}
                        >
                          <CloseIcon sx={{ fontSize: '18px' }} />
                        </Button>
                        <Snackbar
                          sx={{ marginTop: '200px' }}
                          open={open}
                          anchorOrigin={{
                            vertical,
                            horizontal,
                          }}
                          onClose={handleClose}
                          autoHideDuration={2000}
                        >
                          <Alert
                            onClose={handleClose}
                            severity="warning"
                            variant="filled"
                          >
                            Cart Item Deleted Successfully
                          </Alert>
                        </Snackbar>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h5" component="h5">
                    Sub Total (
                    {cartItems?.reduce((acc, curr) => acc + curr.quantity, 0)})
                    :
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="h6">
                    $
                    {getUptoTwoDecimal(
                      cartItems?.reduce(
                        (acc, curr) => acc + curr.quantity * curr.price,
                        0
                      )
                    )}
                  </Typography>
                </ListItem>

                <ListItem>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default CartScreen;
