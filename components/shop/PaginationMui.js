import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import deviceDimension from '../../utils/devicePixel';

const PaginationMui = ({ products, pageSize, setPageSize }) => {
  const [page, setPage] = useState(1);
  const [{ numOfProductsPerPage }, dispatch] = useStateValue();

  // change the page with a fixed number of images
  const handlePage = (event, value) => {
    setPage(value);
    const pageFrom = (value - 1) * numOfProductsPerPage;
    const pageTo = pageFrom + numOfProductsPerPage;
    // console.log('PAGE FROM & TO ==> ', pageFrom, pageTo);
    setPageSize({ ...pageSize, from: pageFrom, to: pageTo });
  };

  const productCount = 1;

  // Number of pagination button setup
  const numberOfProducts = deviceDimension() * productCount;
  const pageCount = Math.ceil(products.length / numberOfProducts);

  useEffect(() => {
    dispatch({
      type: 'PRODUCT_PER_PAGE',
      payload: pageCount,
    });
  }, [dispatch, pageCount]);

  // During initial page load, the default images will show
  useEffect(() => {
    // const numberOfProducts = deviceDimension() * productCount;
    const pageFrom = (page - 1) * numberOfProducts;
    const pageTo = pageFrom + numberOfProducts;
    setPageSize({ ...pageSize, from: pageFrom, to: pageTo });
  }, [page, setPageSize, pageSize, numberOfProducts]);

  useEffect(() => {
    const handleResize = () => {
      const pageFrom = (page - 1) * numberOfProducts;
      const pageTo = pageFrom + numberOfProducts;
      // console.log('PAGE FROM & TO ==> ', pageFrom, pageTo);
      setPageSize({ ...pageSize, from: pageFrom, to: pageTo });
      dispatch({
        type: 'PRODUCT_PER_PAGE',
        payload: pageCount,
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch, numberOfProducts, page, pageSize, pageCount, setPageSize]);

  return (
    <Pagination
      variant="outlined"
      color="primary"
      count={numOfProductsPerPage}
      page={page}
      onChange={handlePage}
    />
  );
};

export default PaginationMui;
