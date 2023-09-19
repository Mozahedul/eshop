import { Button, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <Grid
      container
      columnSpacing={8}
      // flexWrap={{ xs: 'wrap', md: 'nowrap' }}
      // columns={{ xs: 12, md: 2, lg: 3 }}
      sx={{ marginTop: '30px', bgcolor: '#222529', padding: '60px 80px 30px' }}
    >
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          CONTACT INFO
        </Typography>
        <div>
          <Typography
            variant="subtitle2"
            sx={{ color: 'white', marginTop: '15px' }}
          >
            ADDRESS:
          </Typography>
          <Typography variant="caption" sx={{ color: '#d9d9d9' }}>
            1234 Street Norther Island, USA
          </Typography>
        </div>
        <div>
          <Typography
            variant="subtitle2"
            sx={{ color: 'white', marginTop: '15px' }}
          >
            PHONE:
          </Typography>
          <Typography variant="caption" sx={{ color: '#d9d9d9' }}>
            (+880) 1738 - 648749
          </Typography>
        </div>
        <div>
          <Typography
            variant="subtitle2"
            sx={{ color: 'white', marginTop: '15px' }}
          >
            EMAIL:
          </Typography>
          <Typography variant="caption" sx={{ color: '#d9d9d9' }}>
            admin@example.com
          </Typography>
        </div>
        <div>
          <Typography
            variant="subtitle2"
            sx={{ color: 'white', marginTop: '15px' }}
          >
            WORKING DAYS/HOURS:
          </Typography>
          <Typography variant="caption" sx={{ color: '#d9d9d9' }}>
            Mon - Sun / 9:00 AM - 8:00 PM
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '15px',
            marginTop: { xs: '30px', md: '0' },
          }}
        >
          <Link href="/customer-service">CUSTOMER SERVICE</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="help-faq">Help & FAQs</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="order-tracking">Order Tracking</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="shipping-delivery">Shipping & Delivery</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="orders-history">Orders History</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="advanced-search">Advanced Search</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="my-account">My Account</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="careers">Careers</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="about-us">About Us</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="corporate-sales">Corporate Sales</Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#d9d9d9' }}
        >
          <Link href="privacy">Privacy</Link>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '15px',
            marginTop: { xs: '30px', md: '0' },
          }}
        >
          POPULAR TAGS
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Bag
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Black
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Blue
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Clothes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Fashion
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Hub
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Shirts
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Shoes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Skirts
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Sports
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ margin: '3px' }}
          >
            Sweater
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '15px',
            marginTop: { xs: '30px', lg: '0' },
          }}
        >
          SUBSCRIBE NEWSLETTER
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#d9d9d9', marginBottom: '15px' }}
        >
          Get all the latest information on events, sales and offers. Sign up
          for newsletter:
        </Typography>
        <form action="#">
          <input
            placeholder="Email address"
            style={{
              padding: '15px',
              borderRadius: '100px',
              width: '100%',
              backgroundColor: '#292c30',
              outline: 'none',
              border: 'none',
              color: 'white',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '15px',
              borderRadius: '100px',
              width: '120px',
              backgroundColor: '#1688cc',
              outline: 'none',
              border: 'none',
              color: 'white',
              fontWeight: 'bold',
              marginTop: '15px',
              cursor: 'pointer',
            }}
          >
            SUBSCRIBE
          </button>
        </form>
      </Grid>
    </Grid>
  );
};

export default Footer;
