import Link from 'next/link';
import React, { useRef, useState } from 'react';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { useRouter } from 'next/router';
import * as Mui from '../muiImportComponents/ProductMUI';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import StarRating from '../StarRating';
import ProductDialog from '../ProductDialog';

const ProductCard = ({ product }) => {
  const router = useRouter();
  const cartRef = useRef();
  const cardRef = useRef();
  const [openDialog, setOpenDialog] = useState(false);
  const [state, dispatch] = useStateValue();
  const [menuState, setMenuState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { open, vertical, horizontal } = menuState;
  const {
    cart: { cartItems },
  } = state;

  console.log('PRODUCT => ', product);

  const addToCartHandler = (productAdd, newState) => {
    // console.log('INDEX.JS ==>', productAdd);
    setMenuState({ ...newState, open: true });
    if (productAdd) {
      dispatch({
        type: 'CART_ITEM_ADDED',
        payload: { ...productAdd, quantity: 1 },
      });
    }
    // router.push('/cart');
  };

  // Close snackbar
  const handleClose = () => {
    setMenuState({ ...menuState, open: false });
  };

  // Handle hover of shopping cart menus
  const handleCartMenusHover = () => {
    cartRef.current.style.width = '100%';
    cartRef.current.style.opacity = 1;
    cardRef.current.style.border = '2px solid rgb(240,192,0)';
    cardRef.current.style.boxShadow = '0px 1px 8px 1px lightgray';
  };

  // Handle hover out of shopping cart menus
  const handleCartMenusHoverOut = () => {
    cartRef.current.style.width = 0;
    cartRef.current.style.opacity = 0;
    cardRef.current.style.border = '1px solid lightgray';
    cardRef.current.style.boxShadow = '0px 1px 4px 1px lightgray';
  };

  // View product handler
  const handleViewProduct = event => {
    event.stopPropagation();
    setOpenDialog(true);
  };

  // Click on product cart and move to product details page
  const handleProductClick = event => {
    event.stopPropagation();
    router.push(`/product/${product.slug}`);
  };

  // Cart exist checking
  const cartExistHandler = productCart => {
    const cartExist = cartItems?.some(item => item._id === productCart._id);
    return (
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events

      productCart.countInStock <= 0 ? (
        <Mui.Button variant="outlined">Out of Stock</Mui.Button>
      ) : cartExist ? (
        <Mui.IconButton
          size="small"
          disabled={cartExist}
          title="Already Added to Cart"
        >
          <AddShoppingCartRoundedIcon fontSize="small" />
        </Mui.IconButton>
      ) : (
        <Mui.IconButton
          sx={{ color: 'white' }}
          onClick={() =>
            addToCartHandler(productCart, {
              vertical: 'top',
              horizontal: 'center',
            })
          }
          disabled={productCart.countInStock <= 0 || cartExist}
        >
          <AddShoppingCartRoundedIcon fontSize="small" />
        </Mui.IconButton>
      )
    );
  };

  return (
    <Mui.Card
      ref={cardRef}
      sx={{ position: 'relative', border: '1px solid lightgray' }}
      onMouseOver={handleCartMenusHover}
      onMouseLeave={handleCartMenusHoverOut}
    >
      {/* <Link href={`/product/${product.slug}`}> */}
      <Mui.CardActionArea component="div" onClick={handleProductClick}>
        <Mui.CardMedia
          component="img"
          image={product?.images?.[0]}
          title={product?.title}
        />
        <Mui.CardContent>
          {/* Wishlist, view, compare, and shopping cart */}
          <Mui.Box
            ref={cartRef}
            sx={{
              width: '0',
              opacity: '0',
              position: 'absolute',
              zIndex: '888',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              whiteSpace: 'nowrap',
              backgroundColor: 'rgb(240,192,0)',
              textAlign: 'center',
              transition: '0.5s ease-in-out',
            }}
          >
            {/* View Icon */}
            <Mui.IconButton
              sx={{ color: 'white' }}
              onClick={event => handleViewProduct(event)}
            >
              <VisibilityRoundedIcon fontSize="small" />
            </Mui.IconButton>
            <ProductDialog
              open={openDialog}
              setOpen={setOpenDialog}
              product={product}
              cardRef={cardRef}
              cartRef={cartRef}
            />
            {/* Wishlist Icon */}
            <Mui.IconButton sx={{ color: 'white' }}>
              <FavoriteBorderRoundedIcon fontSize="small" />
            </Mui.IconButton>
            {/* Compare Icon */}
            <Mui.IconButton sx={{ color: 'white' }}>
              <AutorenewRoundedIcon fontSize="small" />
            </Mui.IconButton>
            {/* Shopping cart icon */}
            {cartExistHandler(product)}
          </Mui.Box>
          <Mui.Typography variant="subtitle2">{product.title}</Mui.Typography>
          <Mui.Box>
            <StarRating rating={product?.totalRating} starSize="18px" />
          </Mui.Box>
          <Mui.Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
            ${product.price}
          </Mui.Typography>
        </Mui.CardContent>
      </Mui.CardActionArea>
      {/* </Link> */}
      <Mui.CardActions>
        {/* Wishlist, compare, add to cart, view buttons */}

        <Mui.Snackbar
          sx={{ marginTop: '200px', width: '100%' }}
          open={open}
          onClose={handleClose}
          autoHideDuration={5000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Mui.Alert severity="success" onClose={handleClose} variant="filled">
            Product added to cart successfully. &nbsp;
            <Link href="/cart">
              <Mui.Button
                sx={{ marginTop: '15px' }}
                variant="outlined"
                color="primary"
                size="small"
              >
                View Cart
              </Mui.Button>
            </Link>
          </Mui.Alert>
        </Mui.Snackbar>
      </Mui.CardActions>
    </Mui.Card>
  );
};

export default ProductCard;
