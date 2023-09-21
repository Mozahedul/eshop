/* eslint-disable no-param-reassign */
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import Image from 'next/legacy/image';
import React, { useState } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import ReactHtmlParser from 'react-html-parser';
import StarRating from './StarRating';
import * as Mui from './muiImportComponents/HomeMUI';
import addToCartHandle from '../utils/functions/AddToCart';
import { useStateValue } from '../utils/contextAPI/StateProvider';

const ProductDialog = ({ open, setOpen, product, cartRef, cardRef }) => {
  const [qty, setQty] = useState(1);
  const router = useRouter();
  const [, dispatch] = useStateValue();

  // Quantity update handler
  const cartQuantityHandler = event => setQty(event.target.value);

  const closeHandle = event => {
    event.stopPropagation();
    setOpen(false);
    cartRef.current.style.width = 0;
    cartRef.current.style.opacity = 0;
    cardRef.current.style.border = 'none';
    cardRef.current.style.boxShadow = 'none';
  };

  // Add product to shopping cart function
  const handleAddToCart = () => {
    addToCartHandle(product, dispatch, qty, router);
  };

  return (
    <Dialog open={open} onClose={closeHandle}>
      <Grid
        container
        columnSpacing={1}
        onClick={event => event.stopPropagation()}
      >
        <Grid item xs={12} md={5}>
          <Image
            src={product?.images?.[0].replace('./public', '')}
            width="600"
            height="600"
            alt={product.title}
            priority
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <DialogTitle sx={{ lineHeight: '22px', fontSize: '18px' }}>
            {product.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {product.numReviews > 0 ? (
                <Mui.Box sx={{ display: 'flex' }}>
                  <StarRating rating={product.totalRating} starSize="18px" />
                  <small>({product.numReviews}) ratings</small>
                </Mui.Box>
              ) : (
                ''
              )}

              <Typography variant="subtitle2" fontSize="22px" color="orange">
                ${product.price}
              </Typography>
              <Typography>
                <strong>Short Description: </strong>
                {product.shortDescription}
              </Typography>
              <Typography>
                <strong>Brand: </strong>
                {product.brand}
              </Typography>
              <Typography>
                <strong>Availability: </strong>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </Typography>
              <Mui.Box>
                <strong>Quantity: </strong>
                <Select
                  value={qty}
                  onChange={event => cartQuantityHandler(event)}
                  size="small"
                >
                  {[...Array(product.countInStock).keys()].map(item => (
                    <MenuItem
                      key={uuidv4()}
                      value={item + 1}
                      onClick={event => event.stopPropagation()}
                    >
                      {/* Onclick event here to stop event bubbling */}
                      {item + 1}
                    </MenuItem>
                  ))}
                </Select>
              </Mui.Box>
              {/* Add to cart, wishlist, and compare buttons */}
              <Mui.Box sx={{ marginTop: '10px' }}>
                {/* Add to cart button */}
                <IconButton
                  onClick={handleAddToCart}
                  disabled={product.countInStock <= 0}
                  size="small"
                  sx={{ color: 'orange' }}
                >
                  <ShoppingCartOutlinedIcon />
                </IconButton>
                <IconButton
                  disabled={product.countInStock <= 0}
                  size="small"
                  sx={{ color: 'orange', margin: '0 5px' }}
                >
                  <FavoriteBorderOutlinedIcon />
                </IconButton>
                <IconButton
                  disabled={product.countInStock <= 0}
                  size="small"
                  sx={{ color: 'orange' }}
                >
                  <AutorenewOutlinedIcon />
                </IconButton>
              </Mui.Box>
              <Typography sx={{ marginTop: '30px' }}>
                <strong
                  style={{
                    borderBottom: '2px solid lightgray',
                    paddingBottom: '5px',
                    marginBottom: '5px',
                  }}
                >
                  Description:{' '}
                </strong>
                {ReactHtmlParser(product.description)}
              </Typography>
            </DialogContentText>
          </DialogContent>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ProductDialog;
