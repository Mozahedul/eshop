/* eslint-disable import/no-unresolved */
import { useState } from 'react';
import Layout from '../components/Layout';
import AdTracking from '../components/home/AdTracking';
import BestSelling from '../components/home/BestSelling';
import HomeSlider from '../components/home/HomeSlider';
import NewArrival from '../components/home/NewArrival';
import TopRatedProducts from '../components/home/TopRatedProducts';
import deviceDimension from '../utils/devicePixel';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Brands from './Brands';

export default function Home() {
  const [pixel, setPixel] = useState(null);

  // Refresh the page during resize the web page
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', function () {
      setPixel(deviceDimension());
    });
  }

  return (
    <Layout title="Products Page" description="Products page of Next Amazon">
      <div>
        {/* Home Slider */}
        <HomeSlider />
        {/* For track the product selling */}
        <AdTracking />

        {/* New arrival products */}
        <NewArrival pixel={pixel} setPixel={setPixel} />

        {/* Best selling products */}
        <BestSelling pixel={pixel} setPixel={setPixel} />

        {/* Brands */}
        <Brands />

        {/* Top rated products */}
        <TopRatedProducts pixel={pixel} setPixel={setPixel} />
      </div>
    </Layout>
  );
}
