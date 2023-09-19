export const initialState = {
  orders: [],
  order: {},
  loadRating: true,
  loadingCategory: true,
  loadingSubCategory: true,
  loadingProduct: true,
  loadingBanner: true,
  loading: true,
  loadingSubmit: false,
  error: '',
  loadingPay: true,
  errorPay: '',
  darkMode: false,
  viewedProducts: [],
  productReviews: [],
  cart: {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: '',
  },
  userInfo: null,
  tinymceText: '',
  numOfProductsPerPage: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'PRODUCT_PER_PAGE':
      return {
        ...state,
        numOfProductsPerPage: action.payload,
      };
    case 'TINYMCE_SUCCESS':
      return {
        ...state,
        tinymceText: action.payload,
      };

    case 'REVIEW_REQUEST':
      return {
        ...state,
        loadRating: true,
        error: null,
      };

    case 'REVIEW_SUCCESS':
      return {
        ...state,
        loadRating: false,
        error: null,
      };

    case 'REVIEW_FAIL':
      return {
        ...state,
        loadRating: false,
        error: action.payload,
      };

    case 'RECENTLY_VIEWED':
      return {
        ...state,
        viewedProducts: [...state.viewedProducts, action.payload],
      };

    case 'BANNER_REQUEST':
      return {
        ...state,
        loadingBanner: true,
        error: null,
      };
    case 'BANNER_SUCCESS':
      return {
        ...state,
        loadingBanner: false,
        error: null,
      };
    case 'BANNER_FAIL':
      return {
        ...state,
        loadingBanner: false,
        error: action.payload,
      };

    case 'PRODUCT_REQUEST':
      return {
        ...state,
        loadingProduct: true,
        error: null,
      };

    case 'PRODUCT_SUCCESS':
      return {
        ...state,
        loadingProduct: false,
        error: null,
      };

    case 'PRODUCT_FAIL':
      return {
        ...state,
        loadingProduct: false,
        error: action.payload,
      };

    case 'REQUEST_CREATE':
      return {
        ...state,
        loadingSubmit: true,
        error: '',
      };

    case 'REQUEST_SUCCESS':
      return {
        ...state,
        loadingSubmit: false,
        error: '',
      };

    case 'REQUEST_FAIL':
      return {
        ...state,
        loadingSubmit: false,
        error: action.payload,
      };

    case 'CATEGORY_REQUEST':
      return {
        ...state,
        loadingCategory: true,
        error: '',
      };

    case 'CATEGORY_SUCCESS':
      return {
        ...state,
        loadingCategory: false,
        error: null,
      };

    case 'CATEGORY_FAIL':
      return {
        ...state,
        loadingCategory: false,
        error: action.payload,
      };

    case 'SUBCATEGORY_REQUEST':
      return {
        ...state,
        loadingSubCategory: true,
        error: null,
      };
    case 'SUBCATEGORY_SUCCESS':
      return {
        ...state,
        loadingSubCategory: false,
        error: null,
      };
    case 'SUBCATEGORY_FAIL':
      return {
        ...state,
        loadingSubCategory: true,
        error: action.payload,
      };

    case 'FETCH_ORDERS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };

    case 'PAY_REQUEST':
      return {
        ...state,
        loadingPay: true,
      };

    case 'PAY_SUCCESS':
      return {
        ...state,
        loadingPay: false,
        order: action.payload,
      };

    case 'PAY_FAIL':
      return {
        ...state,
        loadingPay: false,
        errorPay: action.payload,
      };

    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
        error: '',
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: '',
      };

    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'DARK_MODE_ON':
      return {
        ...state,
        darkMode: true,
      };

    case 'DARK_MODE_OFF':
      return {
        ...state,
        darkMode: false,
      };

    case 'CART_ITEM_ADDED': {
      const cartProducts = state.cart.cartItems;
      const newItem = action.payload;
      const existItem = cartProducts?.find(item => item._id === newItem._id);
      const cartItems = existItem
        ? cartProducts?.map(item =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }

    case 'REMOVE_CART_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        item => item._id !== action.payload._id
      );

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }

    case 'CART_CLEAR':
      return {
        ...state,
        cart: { ...state.cart, cartItems: action.payload },
      };

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };

    case 'USER_LOGIN':
      return {
        ...state,
        userInfo: action.payload,
      };
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
      };

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    default:
      return state;
  }
};

export default reducer;
