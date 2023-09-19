import {
  Alert,
  Button,
  CircularProgress,
  ListItemText,
  TableBody,
} from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useStateValue } from '../utils/contextAPI/StateProvider';
import { getError } from '../utils/error';

const OrderHistory = () => {
  const [state, dispatch] = useStateValue();
  const { loading, error, userInfo, orders } = state;
  // const router = useRouter();

  // console.log('ORDERS ==> ', orders);

  const cookieUser = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : {};

  const userDetails = userInfo || cookieUser;

  console.log(userDetails);

  useEffect(() => {
    // if (!userInfo) {
    //   router.push('/login');
    // }
    async function fetchOrders() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userDetails.token}` },
        });
        if (data.length > 0) {
          dispatch({ type: 'FETCH_ORDERS', payload: data });
        } else {
          dispatch({ type: 'FETCH_FAIL', payload: 'No orders has been found' });
        }
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        toast.error(`Order has not fetched` + getError(err));
      }
    }

    fetchOrders();
  }, [dispatch, userDetails.token]);

  // Format the date coming from database
  const paidDate = dateStr => {
    const newDate = new Date(dateStr);
    const formatDate = newDate.toLocaleString();
    // console.log(formatDate);
    return formatDate;
  };

  return (
    <Layout
      title="Order history"
      description="Order history showing for specific user"
    >
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <CircularProgress size="3rem" color="success" />
        </div>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2} marginTop="30px">
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <Link href="/profile">
                  <ListItem button>
                    <ListItemText primary="User Profile">
                      User Profile
                    </ListItemText>
                  </ListItem>
                </Link>
                <Link href="/order-history">
                  <ListItem selected button>
                    <ListItemText primary="User History">
                      Order History
                    </ListItemText>
                  </ListItem>
                </Link>
              </List>
            </Card>
          </Grid>
          <Grid item md={9} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">Order History</Typography>
                </ListItem>
              </List>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>DATE</TableCell>
                      <TableCell>TOTAL</TableCell>
                      <TableCell>PAID</TableCell>
                      <TableCell>DELIVERED</TableCell>
                      <TableCell>ACTION</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {orders.length > 0 &&
                      orders?.map(order => (
                        <TableRow key={order._id}>
                          <TableCell>{order._id.substring(20, 24)}</TableCell>
                          <TableCell>
                            {order.paidAt
                              ? paidDate(order.paidAt)
                              : 'Pay, Please!'}
                          </TableCell>
                          <TableCell>${order.totalPrice}</TableCell>
                          <TableCell>
                            {order.isPaid === true ? 'Paid' : 'Not paid'}
                          </TableCell>
                          <TableCell>
                            {order.isDelivered === true
                              ? 'Delivered'
                              : 'Not Delivered'}
                          </TableCell>
                          <TableCell>
                            <Link href={`/order/${order._id}`}>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                              >
                                DETAILS
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default OrderHistory;
