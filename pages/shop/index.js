/* eslint-disable import/no-unresolved */
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  ListItemButton,
  MenuList,
  Paper,
  Slider,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../components/Layout';
import ShopProducts from '../../components/shop/ShopProducts';

const Shop = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState([]);
  const [priceValue, setPriceValue] = useState([]);
  const [visibleCat, setVisibleCat] = useState(4);
  const [selectedIndex, setSelectedIndex] = useState();
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [productBrands, setProductBrands] = useState([]);

  // Category visibility
  const categoriesToShow = categories.length && categories.slice(0, visibleCat);

  const handleCatVisibility = () => {
    setVisibleCat(visibleCat + 4);
  };

  const handleCatLessVisibility = () => {
    setVisibleCat(4);
  };

  // Show products with category
  const handleProductsWithCat = async (catId, index) => {
    setSelectedIndex(index);
    try {
      const { data } = await axios.get(
        `/api/products/products-category/${catId}`
      );
      setProducts(data);
    } catch (error) {
      toast.error(error);
    }
  };

  // Find the minimum and maximum price
  const minPriceValue = priceValue?.[0];
  const maxPriceValue = priceValue?.[1];

  // const secretKey = process.env.NEXT_PUBLIC_CRYPTOJS_SECRET_KEY;

  // Encryption with crypt-js NPM package
  // const encryptionHandle = msg => {
  //   const encryptInfo = CryptoJS.AES.encrypt(
  //     JSON.stringify(msg),
  //     secretKey
  //   ).toString();
  //   return encryptInfo;
  // };

  // const decryption = () => {
  //   const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  //   const decryptInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //   setDecryptedMessage(decryptInfo);
  // };

  // Handle price slider
  const handleSlider = (event, newValue) => {
    setValue(newValue);

    async function fetchProductsByPrice() {
      try {
        const { data } = await axios.get(
          `/api/products/shopProducts?priceArr=${newValue}`
        );
        setProducts(data);
      } catch (error) {
        toast.error(error);
      }
    }

    fetchProductsByPrice();
  };

  // handle the checkbox selection
  const handleCheckbox = async brand => {
    if (checkedBrands.includes(brand)) {
      const filteredBrands = checkedBrands.filter(
        checkedBrand => checkedBrand !== brand
      );
      setCheckedBrands(filteredBrands);
    } else {
      setCheckedBrands([...checkedBrands, brand]);
    }
  };

  // Fetching products according to brands
  useEffect(() => {
    // let isDiscarded = false;
    // if (!isDiscarded) {
    try {
      const fetchBrands = async () => {
        // console.log('CHECKED BRANDS', checkedBrands);
        const { data } = await axios.get(
          `/api/products/brand?brand=${checkedBrands}`
        );
        setProducts(data);
      };
      fetchBrands();
    } catch (error) {
      toast.error(error);
    }
    // }

    // return () => {
    //   isDiscarded = true;
    // };
  }, [checkedBrands]);

  // Showing all brands
  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get('/api/products/brands');
        setProductBrands(data);
      } catch (error) {
        toast.error(error);
      }
    };

    fetchBrands();
    // }

    // return () => {
    //   isCancelled.current = true;
    // };
    // // Handle brands with checkbox
    // // Here, uniqObject will store an object inside multiple objects
    // const uniqObject = products.reduce((uniqProduct, currObj) => {
    //   if (!uniqProduct[currObj.brand]) {
    //     // eslint-disable-next-line no-param-reassign
    //     uniqProduct[currObj.brand] = currObj;
    //   }
    //   return uniqProduct;
    // }, {});

    // // Make an array from the value of the object
    // const uniqBrands = Object.values(uniqObject);
    // setProductBrands(uniqBrands);
  }, []);

  // For fetching the categories from backend
  // const isDiscarded = useRef(false);
  useEffect(() => {
    // if (!isDiscarded.current) {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/category/client/view');
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
    // }

    // return () => {
    //   isDiscarded.current = true;
    // };
  }, []);

  // For determining the maximum and minimum product price
  // const isOmitted = useRef(false);
  useEffect(() => {
    // if (!isOmitted.current) {
    try {
      const fetchMaxMinPrice = async () => {
        const { data } = await axios.get('/api/products/maxMinPrice');
        // console.log(data);
        const prices = [];

        // Calcualte price and convert decimal to integer
        const minPrice = data.length && Math.floor(data[0].minPrice);
        prices.push(minPrice);

        const maxPrice = data.length && Math.ceil(data[0].maxPrice);
        prices.push(maxPrice);
        console.log('PRICE ==> ', prices);
        setValue(prices);
        setPriceValue(prices);
      };
      fetchMaxMinPrice();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
    // }

    // return () => {
    //   isOmitted.current = true;
    // };
  }, []);

  // For fetching the product from backend
  // const isExpelled = useRef(false);
  useEffect(() => {
    // if (!isExpelled.current) {
    try {
      const fetchProducts = async () => {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      };

      fetchProducts();
    } catch (error) {
      toast.error(error);
    }
    // }

    // return () => {
    //   isExpelled.current = true;
    // };
  }, []);

  return (
    <Layout
      title="shop page"
      description="For showing all the products of the shop"
    >
      <Breadcrumbs breadcrumbs={router.asPath.split('/')} />
      <Typography variant="h1">Shop</Typography>
      <Grid container spacing={3}>
        {/* Sidebar of shop page */}
        <Grid item xs={12} md={3}>
          {/* Categories sidebar */}
          <Typography variant="h6" component="h6" marginBottom="10px">
            By Categories
          </Typography>
          <Paper>
            <MenuList dense>
              {categoriesToShow.length &&
                categoriesToShow.map((category, index) => (
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={() => handleProductsWithCat(category._id, index)}
                    key={uuidv4()}
                    sx={{ fontWeight: '500', color: 'gray', fontSize: '14px' }}
                  >
                    {category.name} ({category.productCount})
                  </ListItemButton>
                ))}
              <Box display="flex">
                <Button
                  disabled={visibleCat >= categories.length}
                  onClick={handleCatVisibility}
                  variant="outlined"
                  color="primary"
                  size="small"
                  fontSize="small"
                  sx={{
                    marginLeft: '10px',
                    marginTop: '10px',
                    display: 'block',
                  }}
                >
                  More
                </Button>
                <Button
                  onClick={handleCatLessVisibility}
                  disabled={visibleCat <= 4}
                  variant="outlined"
                  color="warning"
                  size="small"
                  fontSize="small"
                  sx={{
                    marginLeft: '10px',
                    marginTop: '10px',
                    display: 'block',
                  }}
                >
                  Less
                </Button>
              </Box>
            </MenuList>
          </Paper>

          {/* Price Sidebar */}
          <Typography
            variant="h6"
            component="h6"
            marginBottom="10px"
            marginTop="30px"
          >
            By Price
          </Typography>
          <Box paddingRight="30px" paddingLeft="10px">
            <Slider
              value={value}
              min={minPriceValue}
              max={maxPriceValue}
              step={10}
              onChange={handleSlider}
              valueLabelDisplay="auto"
            />

            <Typography>
              Price: ${value[0]} - ${value[1]}
            </Typography>
          </Box>

          {/* Brand sidebar */}
          <Typography
            variant="h6"
            component="h6"
            marginBottom="10px"
            marginTop="30px"
          >
            By Brand
          </Typography>
          <Paper sx={{ padding: '10px' }}>
            <FormGroup
              sx={{
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                overflowY: 'auto',
              }}
            >
              {productBrands.length &&
                productBrands?.map(product => (
                  <FormControlLabel
                    key={uuidv4()}
                    label={`${product.brand} (${product.count})`}
                    control={
                      <Checkbox
                        size="small"
                        checked={checkedBrands.includes(product.brand)}
                        onChange={() => handleCheckbox(product.brand)}
                      />
                    }
                  />
                ))}
            </FormGroup>
          </Paper>
        </Grid>
        {/* Products container */}
        <Grid item xs={12} md={9}>
          <ShopProducts products={products} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Shop;
