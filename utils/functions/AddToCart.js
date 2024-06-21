import axios from 'axios';

// Add product to cart
const addToCartHandle = async (product, dispatch, qty, router) => {
  try {
    const response = await axios({
      method: 'get',
      url: `/api/products/${product._id}`,
    });

    console.log('RESPONSE STATUS TEXT ==> ', response.statusText);

    if (response.statusText === 'OK') {
      dispatch({
        type: 'CART_ITEM_ADDED',
        payload: { ...product, quantity: qty },
      });

      router.push('/cart');
    }
  } catch (error) {
    console.log('Request cancelled ==> ', error.message);
  }
  return true;
};

export default addToCartHandle;
