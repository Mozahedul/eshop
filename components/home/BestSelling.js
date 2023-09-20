import axios from 'axios';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import deviceDimension from '../../utils/devicePixel';
import * as Mui from '../muiImportComponents/HomeMUI';

const ProductCard = dynamic(() => import('../products/ProductCard'));

// console.log('MUI ==> ', Mui);

const BestSelling = ({ pixel, setPixel }) => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  // const [pixel, setPixel] = useState(null);

  // fetch best selling products
  useEffect(() => {
    // let isDiscarded = false;
    setPixel(deviceDimension());
    const source = axios.CancelToken.source();
    // if (!isDiscarded) {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios(
          {
            method: 'get',
            url: '/api/products/best-seller',
          },
          { cancelToken: source.token }
        );

        if (response.statusText === 'OK') {
          setBestSellingProducts(response.data);
        } else {
          throw new Error('Something went wrong on the server');
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          // console.log('Request cancelled ==> ', error.message);
        } else {
          // console.log('Error without axios ==> ', error.message);
        }
      }
    };

    fetchBestSellingProducts();
    // }
    return () => {
      source.cancel('Operation cancelled by user');
      // isDiscarded = true;
    };
  }, [setPixel]);
  return bestSellingProducts &&
    Array.isArray(bestSellingProducts) &&
    bestSellingProducts.length > 0 ? (
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
          Best Selling Products
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
        {bestSellingProducts?.map(bestProduct => (
          <SwiperSlide key={bestProduct._id}>
            <ProductCard product={bestProduct} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  ) : (
    ''
  );
};

export default BestSelling;
