import axios from 'axios';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as Mui from '../muiImportComponents/HomeMUI';
import deviceDimension from '../../utils/devicePixel';

// Dynamic import by Next.js
const ProductCard = dynamic(() => import('../products/ProductCard'));

const NewArrival = ({ pixel, setPixel }) => {
  const [products, setProducts] = useState([]);

  // for fetching new arrival products
  // const isCancelled = useRef(false);
  useEffect(() => {
    setPixel(deviceDimension());
    // const source = axios.CancelToken.source();
    // if (!isCancelled.current) {
    const fetchProducts = async () => {
      try {
        // Fetching new products with axios
        const response = await axios(
          {
            method: 'get',
            url: '/api/home/new-arrivals',
          }
          // { cancelToken: source.token }
        );
        // if (response.statusText === 'OK') {
        setProducts(response.data);
        // } else {
        throw new Error('Something happened wrong on the server');
        // }
      } catch (error) {
        // if (axios.isCancel(error)) {
        console.log('Request not completed ==> ', error.message);
        // } else {
        // console.log('Error without axios ==> ', error.message);
        // }
      }
    };
    fetchProducts();
    // }
    // return () => {
    // isCancelled.current = true;
    //   source.cancel('Operation cancelled by user');
    // };
  }, [setProducts, setPixel]);
  // products - check if products array is null or undefined
  // Array.isArray(products) - check that is array or other data type
  // products.length - check the products array length that the arry is empty or have data
  return products && Array.isArray(products) && products.length > 0 ? (
    <>
      <Mui.Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: '8px',
          marginTop: '60px',
        }}
      >
        <Mui.Typography
          sx={{ width: '100%', height: '2px', backgroundColor: 'lightgray' }}
        />
        <Mui.Typography
          variant="h1"
          component="h1"
          sx={{
            // borderBottom: '4px solid lightgrey',
            whiteSpace: 'nowrap',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          New Arrivals
        </Mui.Typography>
        <Mui.Typography
          sx={{ width: '100%', height: '2px', backgroundColor: 'lightgray' }}
        />
      </Mui.Box>
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={25}
        navigation
        slidesPerView={pixel}
        slidesPerGroup={pixel}
      >
        {products?.map(product => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  ) : (
    ''
  );
};

export default NewArrival;
