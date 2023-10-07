import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import deviceDimension from '../../utils/devicePixel';

const PaginationMui = ({ products, pageSize, setPageSize }) => {
  const [page, setPage] = useState(1);
  const [{ numOfProductsPerPage }, dispatch] = useStateValue();

  console.log('PRODUCTS PER PAGE ==> ', numOfProductsPerPage);

  // change the page with a fixed number of images
  const handlePage = (event, value) => {
    console.log('VALUE ==>', value);

    setPage(value);
    const pageFrom = (value - 1) * numOfProductsPerPage;
    const pageTo = pageFrom + numOfProductsPerPage;
    console.log('PAGE FROM & TO ==> ', pageFrom, pageTo);
    setPageSize({ ...pageSize, from: pageFrom, to: pageTo });
  };

  /**
   * NOTE: STEP 1
   *  productCount is for setting the number of product rows
   *  numberOfProducts = how many products will exist for each button
   *  pageCount = counts the number of pagination button
   */
  const productCount = 3;
  const numberOfProducts = deviceDimension() * productCount;
  const pageCount = Math.ceil(products.length / numberOfProducts);

  /**
   * NOTE: STEP 2
   * Send the number of pagination button to React context API
   */
  useEffect(() => {
    dispatch({
      type: 'PRODUCT_PER_PAGE',
      payload: pageCount,
    });
  }, [dispatch, pageCount]);

  /**
   * NOTE: STEP 3
   *  During initial page load, the images will show
   *  pageFrom = find the begining index of products array
   *  pageTo = find the ending index of products array
   *  setPageSize is used to send the both to it's parent component
   */
  useEffect(() => {
    // const numberOfProducts = deviceDimension() * productCount;
    const pageFrom = (page - 1) * numberOfProducts;
    const pageTo = pageFrom + numberOfProducts;
    setPageSize({ ...pageSize, from: pageFrom, to: pageTo });
  }, [page, setPageSize, pageSize, numberOfProducts]);

  /**
   * NOTE: STEP 4
   * Control product showing by resizing browser window
   * dispatch the products to the react context API
   */
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
