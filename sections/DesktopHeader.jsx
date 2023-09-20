import {
  AppBar,
  Badge,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded';
import LoopIcon from '@mui/icons-material/Loop';
import Image from 'next/legacy/image';
import { useStateValue } from '../utils/contextAPI/StateProvider';
import SearchForm from '../components/SearchForm';
import { StyledToolBar } from '../utils/styles';
import { useRef } from 'react';

const DesktopHeader = () => {
  const router = useRouter();
  const [state, dispatch] = useStateValue();
  const { darkMode, userInfo } = state;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // get cartItems
  const {
    cart: { cartItems },
  } = state;

  // Menu Open handler
  const loginMenuOpenHandler = event => {
    setAnchorEl(event.currentTarget);
  };

  // Menu close handler
  const loginMenuCloseHandler = (event, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  // user logout handler
  const logoutUserHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    localStorage.removeItem('cartItems');
    Cookies.remove('userInfo');
    Cookies.remove('shippingAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };

  // theme color change
  const darkModeChangeHandler = () => {
    dispatch({
      type: !darkMode ? 'DARK_MODE_ON' : 'DARK_MODE_OFF',
    });
    const expiresInOneHour = 1 / 24;
    Cookies.set('darkMode', !darkMode ? 'ON' : 'OFF', {
      sameSite: 'Strict',
      expires: expiresInOneHour,
    });
  };

  const isDiscarded = useRef(false);
  useEffect(() => {
    if (!isDiscarded.current) {
      const cookieTheme = Cookies.get('darkMode');
      dispatch({
        type: cookieTheme === 'ON' ? 'DARK_MODE_ON' : 'DARK_MODE_OFF',
      });

      const userInfoCookie = Cookies.get('userInfo');
      const userLoginInfo = userInfoCookie ? JSON.parse(userInfoCookie) : '';
      dispatch({
        type: 'USER_LOGIN',
        payload: userLoginInfo,
      });
    }
    return () => {
      isDiscarded.current = true;
    };
  }, [dispatch]);

  // get cart items from local storage and send to global state
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isCancelled = useRef(false);
  useEffect(() => {
    if (!isCancelled.current) {
      const cartItemStg = localStorage.getItem('cartItems');
      const cartParsedItem = cartItemStg ? JSON.parse(cartItemStg) : [];

      cartParsedItem?.map(item => {
        dispatch({
          type: 'CART_ITEM_ADDED',
          payload: item,
        });
        return true;
      });
    }

    return () => {
      isCancelled.current = true;
    };
  }, [dispatch]);
  return (
    <>
      {/* Naivation menu */}
      <Paper
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'lightgray',
          paddingLeft: '30px',
          paddingRight: '30px',
        }}
      >
        <Box>
          <Typography variant="caption" fontWeight="bold">
            FREE RETURNS. STANDARD SHIPPING ORDERS $99+
          </Typography>
        </Box>
        <Box display="flex">
          <Typography
            color="default"
            fontSize="12px"
            fontWeight="400"
            padding="8px"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: '16px' }} />{' '}
            <Link href="/store-location">Find a store</Link>
          </Typography>
          <Typography
            color="default"
            fontSize="12px"
            fontWeight="400"
            padding="8px"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <LocalShippingOutlinedIcon sx={{ fontSize: '16px' }} />{' '}
            <Link href="/store-location">Track Your Order</Link>
          </Typography>
          <Typography
            color="default"
            fontSize="12px"
            fontWeight="400"
            padding="8px"
          >
            <Link href="/help">Help</Link>
          </Typography>
        </Box>
      </Paper>
      <AppBar position="static" sx={{ display: { xs: 'none', md: 'block' } }}>
        <StyledToolBar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link href="/">
            <Image src="/logo.png" alt="home loog" width={120} height={48} />
          </Link>
          <List sx={{ flexGrow: 0.5 }}>
            <SearchForm />
          </List>
          <List>
            <ListItem>
              {/* Dark & light mode */}
              <ListItemText>
                <Switch
                  checked={darkMode}
                  onChange={darkModeChangeHandler}
                  color="warning"
                />
              </ListItemText>
              {/* Compare details */}
              <ListItemText sx={{ marginLeft: '20px' }}>
                <Link href="/Compare">
                  <Badge color="secondary">
                    <LoopIcon />
                  </Badge>
                </Link>
              </ListItemText>
              {/* Wishlist details */}
              <ListItemText sx={{ marginLeft: '20px' }}>
                <Link href="/wishlist">
                  <Badge color="secondary">
                    <FavoriteBorderRoundedIcon />
                  </Badge>
                </Link>
              </ListItemText>
              {/* Cart details */}
              <ListItemText sx={{ marginLeft: '20px' }}>
                <Link href="/cart">
                  {cartItems?.length > 0 ? (
                    <Badge color="secondary" badgeContent={cartItems?.length}>
                      <ShoppingBasketRoundedIcon />
                    </Badge>
                  ) : (
                    <ShoppingBasketRoundedIcon />
                  )}
                </Link>
              </ListItemText>
              {/* User Account details */}
              <ListItemText sx={{ marginLeft: '30px' }}>
                {userInfo ? (
                  <>
                    <Button
                      onClick={loginMenuOpenHandler}
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: '40px',
                        color: '#ffffff',
                      }}
                    >
                      {userInfo?.name?.split(' ')[0]}

                      <ArrowDropDownIcon />
                    </Button>
                    <Menu
                      open={open}
                      anchorEl={anchorEl}
                      // to avoid backdropClick during close the menu
                      onClose={(event, reason) => {
                        if (reason && reason !== 'backdropClick') {
                          return true;
                        }
                        loginMenuCloseHandler();
                        return true;
                      }}
                    >
                      <MenuItem
                        onClick={event =>
                          loginMenuCloseHandler(event, '/profile')
                        }
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        onClick={event =>
                          loginMenuCloseHandler(event, '/order-history')
                        }
                      >
                        Order History
                      </MenuItem>
                      <MenuItem onClick={logoutUserHandler}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Link href="/login">Login</Link>
                )}
              </ListItemText>
            </ListItem>
          </List>
        </StyledToolBar>
      </AppBar>

      {/* Naivation menu */}
      <Box
        display={{ xs: 'none', md: 'flex' }}
        justifyContent="center"
        borderBottom="1px solid rgba(242, 242, 242, 0.6)"
        sx={{ backgroundColor: 'lightgray' }}
      >
        <Typography
          color="default"
          fontSize="15px"
          fontWeight="500"
          padding="15px"
        >
          <Link href="/">Home</Link>
        </Typography>
        <Typography
          color="default"
          fontSize="15px"
          fontWeight="500"
          padding="15px"
        >
          <Link href="/shop">Shop</Link>
        </Typography>
        <Typography
          color="default"
          fontSize="15px"
          fontWeight="500"
          padding="15px"
        >
          <Link href="/categories">Categories</Link>
        </Typography>
        <Typography
          color="default"
          fontSize="15px"
          fontWeight="500"
          padding="15px"
        >
          <Link href="/featured">Featured</Link>
        </Typography>
        <Typography
          color="default"
          fontSize="15px"
          fontWeight="500"
          padding="15px"
        >
          <Link href="/blog">Blog</Link>
        </Typography>
        <Typography
          color="default"
          fontSize="15px"
          fontWeight="500"
          padding="15px"
        >
          <Link href="/latest">Latest</Link>
        </Typography>

        <Typography
          color="default"
          fontSize="15px"
          fontWeight="500"
          padding="15px"
        >
          <Link href="/contact">Contact</Link>
        </Typography>
      </Box>
    </>
  );
};

export default DesktopHeader;
