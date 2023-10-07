import { Grid, Stack } from '@mui/material';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import ProductCard from '../products/ProductCard';
import PaginationMui from './PaginationMui';

const ShopProducts = ({ products }) => {
  const [{ numOfProductsShop }] = useStateValue();
  const [pageSize, setPageSize] = useState({ from: 0, to: numOfProductsShop });

  return (
    <>
      <Grid container spacing={2}>
        {products.length > 0 &&
          products?.slice(pageSize.from, pageSize.to).map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={uuidv4()}>
              <ProductCard product={product} />
            </Grid>
          ))}
      </Grid>
      <Stack spacing={2} alignItems="center" marginTop="60px">
        <PaginationMui products={products} setPageSize={setPageSize} />
      </Stack>
    </>
  );
};

export default ShopProducts;
