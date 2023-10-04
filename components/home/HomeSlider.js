import axios from 'axios';
import Image from 'next/legacy/image';
import React, { useEffect, useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter } from 'next/router';
import * as Mui from '../muiImportComponents/HomeMUI';
// import deviceDimension from '../../utils/devicePixel';

const HomeSlider = () => {
  const [bannerData, setBannerData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    // let isDiscarded = false;
    // const source = axios.CancelToken.source();
    // for browser responsiveness
    // setPixel(deviceDimension());
    // if (!isDiscarded) {
    const fetchBanners = async () => {
      try {
        // const {data: banners} = await axios.get("url");
        const response = await axios(
          {
            method: 'get',
            url: '/api/home-slider/banner/view',
          }
          // { cancelToken: source.token }
        );

        if (response.statusText === 'OK') {
          setBannerData(response.data);
        } else {
          throw new Error('Something went wrong on the server');
        }
      } catch (error) {
        // if (axios.isCancel(error)) {
        console.log('Request cancelled ==> ', error.message);
        // } else {
        //   console.log('Error without axios ==> ', error.message);
        // }
      }
    };
    fetchBanners();
    // }
    // return () => {
    // isDiscarded = true;
    //   source.cancel();
    // };
  }, []);
  return (
    <Swiper
      // install the modules of Swiper
      observer
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      slidesPerView={1}
      slidesPerGroup={1}
      navigation
      pagination={{ clickable: true }}
      centeredSlides
      modules={[Autoplay, Pagination, Navigation]}
    >
      {bannerData?.map(banner => (
        <SwiperSlide key={banner._id}>
          <Mui.Box sx={{ position: 'relative' }}>
            <Image
              src={banner.image}
              alt={banner.title}
              width="1280"
              height="500"
              priority
            />
            <Mui.Box
              className="textOverlay"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: { xs: '10px 15px', lg: '30px' },
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <Mui.Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '18px', lg: '48px' },
                  lineHeight: { xs: '20px', lg: '48px' },
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                {banner.title}
              </Mui.Typography>
              <Mui.Typography
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: { xs: '14px', lg: '20px' },
                  lineHeight: '18px',
                  marginTop: '10px',
                }}
              >
                {banner.subtitle}
              </Mui.Typography>
              <Mui.Button
                variant="contained"
                size="small"
                sx={{ marginTop: '15px' }}
                onClick={() => router.push('/shop')}
              >
                Shop Now
              </Mui.Button>
            </Mui.Box>
          </Mui.Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSlider;
