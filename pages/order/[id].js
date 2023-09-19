import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Mui from '../../components/muiImportComponents/OrderMUI';
import CheckoutWizard from '../../components/checkoutWizard';
import Layout from '../../components/Layout';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import { getError } from '../../utils/error';

const Order = ({ params }) => {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [state, dispatch] = useStateValue();
  const router = useRouter();
  // Catch userInfo, order from Global state
  const { userInfo, order, loading, error } = state;

  // destructure the order data
  const {
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    itemPrice,
    orderItems,
    paymentMethod,
    shippingAddress,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = order;

  // transform date into utc date
  const dateStr = new Date(paidAt);
  const paidDate = dateStr.toLocaleString(dateStr);

  const deliverDate = new Date(deliveredAt);
  const deliveredDate = deliverDate.toLocaleString();

  const cookieUserInfo = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : {};
  const userCredentials = userInfo || cookieUserInfo;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        // fetch order data from db
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userCredentials.token}` },
        });
        // console.log('USER INFO TOKEN ==>', userInfo.token);
        // send order data to Global state
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    };
    if (!order._id || (order._id && order._id !== params.id)) {
      fetchOrder();
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get(`/api/keys/paypal`, {
          headers: { authorization: `Bearer ${userCredentials.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });

        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPayPalScript();
    }

    if (!userCredentials) {
      router.push('/login');
    }
  }, [
    order,
    router,
    orderId,
    dispatch,
    paypalDispatch,
    userCredentials,
    params.id,
  ]);

  // create payment with createOrder handler
  function createOrder(data, actions) {
    return actions?.order
      ?.create({
        purchase_units: [
          {
            amount: {
              value: totalPrice,
            },
          },
        ],
      })
      .then(function (orderID) {
        return orderID;
      });
  }

  // Capture payment after approving by user
  function onApprove(data, actions) {
    return actions?.order?.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data: orderPay } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userCredentials.token}` },
          }
        );
        console.log(orderPay);
        dispatch({ type: 'PAY_SUCCESS', payload: orderPay });
        toast.success('Congratulation! ' + orderPay.message);

        setTimeout(() => {
          router.push('/order-history');
        }, 4000);
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  // Show error if any error occurs during payment transaction with paypal
  function onError(err) {
    toast.error(getError(err));
  }

  return (
    <Layout
      title={`Order ${orderId}`}
      description="Order details for payment transaction"
    >
      <CheckoutWizard activeStep={3} />
      <Mui.Typography variant="h1" color="initial">
        Order {orderId}
      </Mui.Typography>
      {loading ? (
        <Mui.CircularProgress size="2rem" color="success" />
      ) : error ? (
        <Mui.Alert severity="error">{error}</Mui.Alert>
      ) : (
        <Mui.Grid container spacing={2}>
          <Mui.Grid item md={9}>
            {/* Shipping address */}
            <Mui.Card sx={{ marginBottom: '30px' }}>
              <Mui.List>
                <Mui.ListItem>
                  <Mui.Typography variant="h6" color="initial">
                    Shipping Address
                  </Mui.Typography>
                </Mui.ListItem>
                <Mui.ListItem>
                  <Mui.Typography variant="body1" color="initial">
                    <strong>{shippingAddress?.fullName}</strong>
                    <br />
                    {shippingAddress?.address},{shippingAddress?.city} <br />
                    {shippingAddress?.postalCode}, {shippingAddress?.country}
                  </Mui.Typography>
                </Mui.ListItem>
                <Mui.ListItem>
                  <Mui.Typography>
                    <strong>Status:</strong>{' '}
                    {isPaid ? (
                      <span style={{ color: 'green' }}>
                        {`Paid at ${paidDate}`}{' '}
                      </span>
                    ) : (
                      <span style={{ color: 'red' }}>Not paid</span>
                    )}
                  </Mui.Typography>
                </Mui.ListItem>
              </Mui.List>
            </Mui.Card>

            {/* Payment method */}
            <Mui.Card sx={{ marginBottom: '30px' }}>
              <Mui.List>
                <Mui.ListItem>
                  <Mui.Typography variant="h6" color="initial">
                    Payment Method
                  </Mui.Typography>
                </Mui.ListItem>
                <Mui.ListItem>
                  <Mui.Typography variant="body1" color="initial">
                    <strong>Method:</strong> {paymentMethod}
                  </Mui.Typography>
                </Mui.ListItem>
                <Mui.ListItem>
                  <Mui.Typography>
                    <strong>Status:</strong>{' '}
                    {isDelivered ? (
                      <span style={{ color: 'green' }}>
                        {`Delivered at ${deliveredDate}`}{' '}
                      </span>
                    ) : (
                      <span style={{ color: 'red' }}>Not Delivered</span>
                    )}
                  </Mui.Typography>
                </Mui.ListItem>
              </Mui.List>
            </Mui.Card>

            {/* Cart Items */}
            <Mui.Card>
              <Mui.TableContainer>
                <Mui.Typography variant="h6" sx={{ padding: '15px 0 0 15px' }}>
                  Order Items
                </Mui.Typography>
                <Mui.Table>
                  <Mui.TableHead>
                    <Mui.TableRow>
                      <Mui.TableCell>Image</Mui.TableCell>
                      <Mui.TableCell>Title</Mui.TableCell>
                      <Mui.TableCell>Quantity</Mui.TableCell>
                      <Mui.TableCell>Price</Mui.TableCell>
                    </Mui.TableRow>
                  </Mui.TableHead>
                  <Mui.TableBody>
                    {orderItems?.map(item => (
                      <Mui.TableRow key={item._id}>
                        <Mui.TableCell>
                          <Image
                            src={item.images[0].replace('./public', '')}
                            alt={item.title}
                            width="50"
                            height="50"
                          />
                        </Mui.TableCell>
                        <Mui.TableCell>{item.title}</Mui.TableCell>
                        <Mui.TableCell>
                          {item.quantity} X {item.price}
                        </Mui.TableCell>
                        <Mui.TableCell>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Mui.TableCell>
                      </Mui.TableRow>
                    ))}
                  </Mui.TableBody>
                </Mui.Table>
              </Mui.TableContainer>
            </Mui.Card>
          </Mui.Grid>

          <Mui.Grid item md={3}>
            <Mui.Card>
              <Mui.List>
                <Mui.ListItem>
                  <Mui.Typography variant="h6">Order Summary</Mui.Typography>
                </Mui.ListItem>
                {/* Item price */}
                <Mui.ListItem>
                  <Mui.Grid container>
                    <Mui.Grid item md={6}>
                      <Mui.Typography variant="subtitle1" color="initial">
                        Items Price
                      </Mui.Typography>
                    </Mui.Grid>
                    <Mui.Grid item md={6}>
                      <Mui.Typography
                        align="right"
                        variant="body1"
                        color="initial"
                      >
                        ${itemPrice}
                      </Mui.Typography>
                    </Mui.Grid>
                  </Mui.Grid>
                </Mui.ListItem>

                {/* Tax price */}
                <Mui.ListItem>
                  <Mui.Grid container>
                    <Mui.Grid item md={6}>
                      <Mui.Typography variant="subtitle1" color="initial">
                        Tax Price
                      </Mui.Typography>
                    </Mui.Grid>
                    <Mui.Grid item md={6}>
                      <Mui.Typography
                        align="right"
                        variant="body1"
                        color="initial"
                      >
                        ${taxPrice}
                      </Mui.Typography>
                    </Mui.Grid>
                  </Mui.Grid>
                </Mui.ListItem>

                {/* Shipping price */}
                <Mui.ListItem>
                  <Mui.Grid container>
                    <Mui.Grid item md={6}>
                      <Mui.Typography variant="subtitle1" color="initial">
                        Shipping Price
                      </Mui.Typography>
                    </Mui.Grid>
                    <Mui.Grid item md={6}>
                      <Mui.Typography
                        align="right"
                        variant="body1"
                        color="initial"
                      >
                        ${shippingPrice}
                      </Mui.Typography>
                    </Mui.Grid>
                  </Mui.Grid>
                </Mui.ListItem>
                <hr />

                {/* Total price */}
                <Mui.ListItem>
                  <Mui.Grid container>
                    <Mui.Grid item md={6}>
                      <Mui.Typography variant="subtitle2" color="initial">
                        Total Price
                      </Mui.Typography>
                    </Mui.Grid>
                    <Mui.Grid item md={6}>
                      <Mui.Typography
                        align="right"
                        variant="body1"
                        color="initial"
                      >
                        ${totalPrice}
                      </Mui.Typography>
                    </Mui.Grid>
                  </Mui.Grid>
                </Mui.ListItem>

                {/* Paypal button for completing payment transaction */}
                {!isPaid && (
                  <>
                    <Mui.ListItem>
                      <Mui.Typography variant="subtitle2" color="secondary">
                        Pay with:
                      </Mui.Typography>
                    </Mui.ListItem>
                    {isPending ? (
                      <div style={{ padding: '0 15px' }}>
                        <Mui.CircularProgress size="2rem" color="success" />
                      </div>
                    ) : (
                      <div style={{ padding: '0 15px' }}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    )}
                  </>
                )}
              </Mui.List>
            </Mui.Card>
          </Mui.Grid>
        </Mui.Grid>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default Order;
