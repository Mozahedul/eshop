import { Grid, Typography } from '@mui/material';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/products/ProductCard';
import Layout from '../../components/Layout';

const Category = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  // console.log('FETCH Products ==> ', products);

  const { categoryId, name } = router.query;
  const secretKey = process.env.NEXT_PUBLIC_CRYPTOJS_SECRET_KEY;

  const bytes = categoryId ? CryptoJS.AES.decrypt(categoryId, secretKey) : '';
  const decryptedData = bytes
    ? JSON.parse(bytes?.toString(CryptoJS.enc.Utf8))
    : '';

  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    try {
      const fetchProducts = async () => {
        const { data } = await axios.get(
          `/api/products/products-category/${decryptedData}`
        );
        setProducts(data);
      };

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
    // }

    // return () => {
    //   isCancelled.current = true;
    // };
  }, [setProducts, decryptedData]);

  return (
    <Layout>
      {products && products.length > 0 ? (
        <>
          <Typography variant="h2" paddingTop="15px" paddingBottom="15px">
            Products for the category of "
            <span style={{ color: 'green' }}>{name}</span>"
          </Typography>
          <Grid container spacing={2}>
            {products.map(product => (
              <Grid key={product._id} item xs={12} md={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography variant="h2">
          Product not found for the category you are searching for
        </Typography>
      )}
    </Layout>
  );
};

export default Category;
