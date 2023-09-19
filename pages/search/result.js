import { useRouter } from 'next/router';
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ProductCard from '../../components/products/ProductCard';

const Result = () => {
  const router = useRouter();
  const products =
    router.query && router.query.products
      ? JSON.parse(router.query.products)
      : [];
  const searchTitle =
    router.query && router.query.searchTitle
      ? JSON.parse(router.query.searchTitle)
      : '';
  const category =
    router.query && router.query.category
      ? JSON.parse(router.query.category)
      : '';

  return (
    <Layout>
      {products.length > 0 ? (
        <Box>
          <Typography marginTop={2}>
            <strong className="highlight">{products?.length}</strong> results
            found for <strong className="highlight">"{searchTitle}"</strong> at
            the category{' '}
            <strong className="highlight">
              "<Link href={`/${category}`}>{category}</Link>"
            </strong>
          </Typography>
          <Grid container spacing={2} marginTop={2}>
            {products?.map(product => (
              <Grid item key={product._id} xs={12} md={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        ''
      )}
    </Layout>
  );
};

export default Result;
