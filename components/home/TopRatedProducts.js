/* eslint-disable import/no-unresolved */
import axios from 'axios';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as Mui from '../muiImportComponents/HomeMUI';
import deviceDimension from '../../utils/devicePixel';
// Import Swiper css
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCard = dynamic(() => import('../products/ProductCard'));

const TopRatedProducts = ({ pixel, setPixel }) => {
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    setPixel(deviceDimension());
    try {
      const fetchTopRatedProducts = async () => {
        const response = await axios(
          { method: 'get', url: '/api/home/top-rated' },
          { cancelToken: source.token }
        );
        if (response.statusText === 'OK') {
          setTopRated(response.data);
        }
      };
      fetchTopRatedProducts();
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(error);
      } else {
        console.log('Error without axios ==> ', error);
      }
    }

    return () => {
      source.cancel();
    };
  }, [setTopRated, setPixel]);
  return topRated && Array.isArray(topRated) && topRated.length > 0 ? (
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
          Top Rated Products
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
        {topRated?.map(product => (
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

export default TopRatedProducts;
