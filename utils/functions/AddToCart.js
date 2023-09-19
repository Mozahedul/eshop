import axios from 'axios';

// Add product to cart
const addToCartHandle = async (product, dispatch, qty, router) => {
  // for handling the error of request cancelling by user
  // taking more time to complete the request
  // prevent unnecessary network trafficking
  const source = axios.CancelToken.source();

  try {
    const response = await axios(
      {
        method: 'get',
        url: `/api/products/${product._id}`,
      },
      { cancelToken: source.token }
    );

    if (response.statusText === 'OK') {
      dispatch({
        type: 'CART_ITEM_ADDED',
        payload: { ...product, quantity: qty },
      });

      router.push('/cart');
      // to cancel the completion of request takes more than 2 seconds
      setTimeout(function () {
        source.cancel('Request cancelled by user');
      }, 2000);
    } else {
      throw new Error('Something went wrong on the server');
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request cancelled ==> ', error.message);
    } else {
      console.log('Error without axios ==> ', error.message);
    }
  }
  return true;
};

export default addToCartHandle;
