/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';

// Import css files for react-slick
import axios from 'axios';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
// import Image from 'next/image';
import { Typography } from '@mui/material';
import ProductCard from './ProductCard';

const RelatedProducts = ({ product }) => {
  const [products, setProducts] = useState([]);

  const categoryId = product?.categories?._id;
  // console.log(products);

  const settings = {
    // dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          // dots: true,
          infinite: true,
          speed: 500,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          // dots: true,
          infinite: true,
          speed: 500,
        },
      },

      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // dots: true,
          infinite: true,
          speed: 500,
        },
      },
    ],
  };

  useEffect(() => {
    let isDiscarded = false;
    if (!isDiscarded) {
      const fetchProducts = async () => {
        const { data } = await axios.get(`/api/product-details/${categoryId}`);
        const filteredProducts = data?.filter(item => item._id !== product._id);
        setProducts(filteredProducts);
      };
      fetchProducts();
    }
    return () => {
      isDiscarded = true;
    };
  }, [categoryId, setProducts, product]);
  return products.length > 0 ? (
    <>
      <Typography variant="h2">Related Products</Typography>
      <Slider {...settings}>
        {products?.map(productData => (
          <ProductCard
            product={productData}
            key={productData._id}
            style={{ margin: '0 10px' }}
          />
        ))}
      </Slider>
    </>
  ) : null;
};

export default RelatedProducts;
