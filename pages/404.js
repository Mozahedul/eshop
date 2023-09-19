import { Grid, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const PageNotFound = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh' }}
    >
      <Grid item>
        <h1 style={{ fontSize: '72px', color: 'red' }}>SORRY</h1>
        <Typography variant="h2" sx={{ marginTop: '-50px' }}>
          We couldn't find that page.
        </Typography>
        <Typography variant="h5">
          Try searching or go to{' '}
          <Link href="/" style={{ color: '#0968c5' }}>
            Next Amazon's home page
          </Link>
        </Typography>
        <Image
          src="/images/dog.png"
          alt="error loading page"
          width="300"
          height="300"
          priority
        />
      </Grid>
    </Grid>
  );
};

export default PageNotFound;
