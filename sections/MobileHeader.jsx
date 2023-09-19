import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Typography,
} from '@mui/material';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import MobileSideMenu from '../components/MobileSideMenu';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import SearchForm from '../components/SearchForm';
import { StyledToolBar } from '../utils/styles';
import { useStateValue } from '../utils/contextAPI/StateProvider';

const MobileHeader = () => {
  const router = useRouter();
  const [state, dispatch] = useStateValue();
  const { darkMode, userInfo } = state;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [hiddenSearch, setHiddenSearch] = useState('none');

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

  // Handle Search form
  const handleSearchForm = () => {
    hiddenSearch === 'none'
      ? setHiddenSearch('block')
      : setHiddenSearch('none');
  };

  // Toggle the mobile sidemenu
  const toggleDrawer = (direction, openDrawer) => () => {
    setDrawerOpen(openDrawer);
  };

  return (
    <AppBar position="static" sx={{ display: { xs: 'block', md: 'none' } }}>
      <StyledToolBar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <List sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/logo.png" alt="home loog" width={90} height={36} />
          </Link>
          <IconButton
            color="primary"
            sx={{ marginLeft: '5px' }}
            onClick={toggleDrawer('left', true)}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>
          <SwipeableDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer('left', false)}
            onOpen={toggleDrawer('left', true)}
          >
            <IconButton
              onClick={toggleDrawer('left', false)}
              size="small"
              color="warning"
              sx={{
                position: 'absolute',
                top: '5px',
                right: '10px',
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
            <Box
              display={{ xs: 'flex', md: 'none' }}
              flexDirection="column"
              justifyContent="start"
              borderBottom="1px solid rgba(242, 242, 242, 0.6)"
              onKeyDown={toggleDrawer('left', false)}
              onClick={toggleDrawer('left', false)}
              sx={{
                backgroundColor: '#292c30',
                color: '#f4f4f4',
                paddingTop: '40px',
                paddingLeft: '20px',
                width: '250px',
                height: '100vh',
              }}
            >
              <Typography
                color="default"
                fontSize="12px"
                textTransform="uppercase"
                fontWeight="400"
                paddingTop="10px"
                paddingBottom="10px"
                borderBottom="1px solid rgba(0, 0, 0, 0.2)"
              >
                <Link href="/">Home</Link>
              </Typography>
              <Typography
                color="default"
                fontSize="12px"
                textTransform="uppercase"
                fontWeight="400"
                paddingTop="10px"
                paddingBottom="10px"
                borderBottom="1px solid rgba(0, 0, 0, 0.2)"
              >
                <Link href="/shop">Shop</Link>
              </Typography>
              <Typography
                color="default"
                fontSize="12px"
                textTransform="uppercase"
                fontWeight="400"
                paddingTop="10px"
                paddingBottom="10px"
                borderBottom="1px solid rgba(0, 0, 0, 0.2)"
              >
                <Link href="/categories">Categories</Link>
              </Typography>
              <Typography
                color="default"
                fontSize="12px"
                textTransform="uppercase"
                fontWeight="400"
                paddingTop="10px"
                paddingBottom="10px"
                borderBottom="1px solid rgba(0, 0, 0, 0.2)"
              >
                <Link href="/featured">Featured</Link>
              </Typography>
              <Typography
                color="default"
                fontSize="12px"
                textTransform="uppercase"
                fontWeight="400"
                paddingTop="10px"
                paddingBottom="10px"
                borderBottom="1px solid rgba(0, 0, 0, 0.2)"
              >
                <Link href="/blog">Blog</Link>
              </Typography>
              <Typography
                color="default"
                fontSize="12px"
                textTransform="uppercase"
                fontWeight="400"
                paddingTop="10px"
                paddingBottom="10px"
                borderBottom="1px solid rgba(0, 0, 0, 0.2)"
              >
                <Link href="/latest">Latest</Link>
              </Typography>

              <Typography
                color="default"
                fontSize="12px"
                textTransform="uppercase"
                fontWeight="400"
                paddingTop="10px"
                paddingBottom="10px"
                borderBottom="1px solid rgba(0, 0, 0, 0.2)"
              >
                <Link href="/contact">Contact</Link>
              </Typography>
              <List>
                <ListItem>
                  <Link
                    href="https://www.facebook.com"
                    style={{ margin: '10px' }}
                  >
                    <FacebookIcon />
                  </Link>

                  <Link
                    href="https://www.twitter.com"
                    style={{ margin: '10px' }}
                  >
                    <TwitterIcon />
                  </Link>

                  <Link
                    href="https://www.pinterest.com"
                    style={{ margin: '10px' }}
                  >
                    <PinterestIcon />
                  </Link>
                </ListItem>
              </List>
            </Box>
          </SwipeableDrawer>
        </List>
        <List
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '15px 30px',
            position: 'absolute',
            top: '70px',
            left: { xs: '30px', sm: '100px' },
            right: { xs: '30px', sm: '100px' },
            zIndex: 99,
            flexGrow: 1,
            display: `${hiddenSearch}`,
          }}
        >
          <SearchForm />
        </List>
        <List>
          <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Dark & light mode */}
            {/* <ListItemText>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
                color="warning"
              />
            </ListItemText> */}
            {/* Compare details */}
            {/* <ListItemText sx={{ marginLeft: '20px' }}>
              <Link href="/Compare">
                <Badge color="secondary">
                  <LoopIcon />
                </Badge>
              </Link>
            </ListItemText> */}
            {/* Wishlist details */}
            <ListItemText>
              <IconButton
                size="small"
                color="primary"
                onClick={handleSearchForm}
              >
                <SearchRoundedIcon sx={{ fontSize: '24px' }} />
              </IconButton>
            </ListItemText>
            <ListItemText sx={{ marginLeft: '15px' }}>
              <Link href="/wishlist">
                <Badge color="secondary">
                  <FavoriteBorderRoundedIcon sx={{ fontSize: '20px' }} />
                </Badge>
              </Link>
            </ListItemText>
            {/* Cart details */}
            <ListItemText sx={{ marginLeft: '15px' }}>
              <Link href="/cart">
                {cartItems?.length > 0 ? (
                  <Badge color="secondary" badgeContent={cartItems?.length}>
                    <ShoppingBasketRoundedIcon sx={{ fontSize: '20px' }} />
                  </Badge>
                ) : (
                  <ShoppingBasketRoundedIcon sx={{ fontSize: '20px' }} />
                )}
              </Link>
            </ListItemText>
            {/* User Account details */}
            <ListItemText sx={{ marginLeft: '15px' }}>
              {userInfo ? (
                <>
                  <Button
                    type="button"
                    onClick={loginMenuOpenHandler}
                    // variant="contained"
                    size="small"
                    style={{
                      color: '#ffffff',
                      fontSize: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      // display: 'flex',
                      // alignItems: 'center',
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
  );
};

export default MobileHeader;
