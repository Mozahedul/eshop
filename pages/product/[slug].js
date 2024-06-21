import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactHtmlParser from 'react-html-parser';
import ReactImageMagnify from 'react-image-magnify';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Divider } from '@mui/material';
import * as MuiIcon from '../../components/muiImportComponents/MUIIcons';
import * as Mui from '../../components/muiImportComponents/ProductMUI';
import Product from '../../models/Product';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import db from '../../utils/db';
import convertDate from '../../utils/functions/dateConverter';
import addToCartHandle from '../../utils/functions/AddToCart';
import handleReviewSubmit from '../../utils/functions/ReviewSubmitHandle';
import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../components/Layout';
import StarRating from '../../components/StarRating';
import ProductCard from '../../components/products/ProductCard';
import RelatedProducts from '../../components/products/RelatedProducts';
import { viewCloudinaryImage } from '../api/cloudinary/cloudinary-config';

// props has been got from getServerSideProps
const ProductScreen = props => {
  const [qty, setQty] = useState(1);
  const [val, setVal] = useState('1');
  const [rating, setRating] = useState('Choose your rating');
  const [reviewsToShow, setReviewsToShow] = useState(1);
  const [showImg, setShowImg] = useState('');
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0);
  const [nextImage, setNextImage] = useState(false);
  const [prevImage, setPrevImage] = useState(true);
  const [highlight, setHighlight] = useState(0);
  const router = useRouter();
  const [{ viewedProducts, userInfo, loadRating, error }, dispatch] =
    useStateValue();
  const { product } = props;

  console.log('PRODUCT FROM SLUG ==> ', product);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const handleRating = event => {
    setRating(event.target.value);
  };

  // get userInfo form localStorage
  const userInfoStg = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';

  const userToken = userInfo || userInfoStg;

  // Find the user already review the product or not
  const userReviewed = product.reviews?.some(
    review => review.postedBy === userToken?._id
  );

  // handle to show limited items
  const handleToShow = () => {
    setReviewsToShow(reviewsToShow + 1);
  };

  // For showing recently viewed products by user
  const filteredProducts = viewedProducts?.filter(
    (elm, index, refArr) =>
      refArr.findIndex(item => item._id === elm._id) === index
  );

  // Quantity update handler
  const cartQuantityHandler = quantity => setQty(quantity);

  const handleChange = (event, newValue) => {
    setVal(newValue);
  };

  // Add product to shopping cart function

  const handleAddToCart = () => addToCartHandle(product, dispatch, qty, router);

  // submit rating form handler
  const reviewSubmitHandle = ratingData => {
    handleReviewSubmit(ratingData, product, axios, toast, userToken, dispatch);
  };

  // Show image on mouseover from sidebar to main container
  const handleProductImage = (image, index) => {
    setShowImg(image);
    setHighlight(index);
  };

  // Image slider - for previous slide images
  const handlePreviousImage = () => {
    setFirstVisibleIndex(prevIndex => prevIndex - 1);
    // console.log('First visible index ==> ', firstVisibleIndex);
    if (firstVisibleIndex <= 1) {
      setPrevImage(true);
      setNextImage(false);
    }
  };

  const handleNextImage = () => {
    setFirstVisibleIndex(prevIndex => prevIndex + 1);
    // console.log('IMAGES LENGTH ==> ', product.images.length);
    if (firstVisibleIndex + 5 <= product.images.length) {
      setNextImage(true);
      setPrevImage(false);
    }
    // console.log(firstVisibleIndex, firstVisibleIndex + 5);
  };

  // For viewing the reviews
  useEffect(() => {
    // const source = axios.CancelToken.source();
    try {
      dispatch({ type: 'REVIEW_REQUEST' });
      const fetchRatings = async () => {
        const response = await axios(
          { method: 'get', url: `/api/products/reviews/${product.slug}` }
          // {
          //   cancelToken: source.token,
          // }
        );

        if (response.status >= 200 && response.status <= 299) {
          // setReviewsProduct(response.data);
          dispatch({ type: 'REVIEW_SUCCESS' });
        } else {
          throw new Error('Something went wrong on the server');
        }
        setValue('reviewName', '');
        setValue('comment', '');
        setValue('ratingStar', 0);
      };
      fetchRatings();
      dispatch({ type: 'REVIEW_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'REVIEW_FAIL', payload: err });
      toast.error(err, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 2000,
      });
    }

    // return () => {
    //   source.cancel();
    // };
  }, [product, userToken, dispatch, setValue]);

  // Get cart item from local storage
  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    const storage = localStorage.getItem('cartItems');
    const cartItemsStg = storage ? JSON.parse(storage) : [];

    cartItemsStg?.map(item => {
      if (item.slug === router.query.slug) {
        setQty(item.quantity);
      }
      return true;
    });
    // For showing recently viewed products
    dispatch({
      type: 'RECENTLY_VIEWED',
      payload: product,
    });

    // When user click the product from bottom of this page
    setShowImg(product.images[0]);
    // setNextImage(true);
    // }
    // return () => {
    //   isCancelled.current = true;
    // };
  }, [setQty, router, dispatch, product]);

  return (
    <Layout title={product.title} description={product.shortDescription}>
      {/* Product details section STARTS */}
      <Breadcrumbs breadcrumbs={router.asPath.split('/')} />
      <Mui.Box style={{ marginTop: '20px' }}>
        {/* Back to shop page button */}
        <Link href="/shop">
          <Mui.Button variant="contained" size="small">
            Back to product
          </Mui.Button>
        </Link>
      </Mui.Box>
      <Mui.Grid container spacing={4} marginTop="10px">
        {/* Product details small images */}
        <Mui.Grid item xs={2} md={1}>
          {product?.images?.length > 5 && (
            <Mui.Button
              fullWidth
              variant="contained"
              size="small"
              sx={{ marginBottom: '12px' }}
              onClick={handlePreviousImage}
              disabled={prevImage}
            >
              <MuiIcon.KeyboardArrowUpIcon />
            </Mui.Button>
          )}
          {product.images
            .slice(firstVisibleIndex, firstVisibleIndex + 5)
            .map((image, index) => (
              <Mui.Box
                key={uuidv4()}
                mb={1}
                className={highlight === index ? 'active' : ''}
                sx={{
                  cursor: 'pointer',
                  boxShadow: '1px 1px 5px 1px rgba(200, 200, 200, 0.5)',
                  borderRadius: '5px',
                }}
                onMouseOver={() => handleProductImage(image, index)}
              >
                <Image
                  src={image}
                  alt={product.title}
                  width={100}
                  height={100}
                  style={{ borderRadius: '5px' }}
                  priority
                />
              </Mui.Box>
            ))}
          {product?.images?.length > 5 && (
            <Mui.Button
              fullWidth
              variant="contained"
              size="small"
              onClick={handleNextImage}
              disabled={nextImage}
            >
              <MuiIcon.KeyboardArrowDownIcon />
            </Mui.Button>
          )}
        </Mui.Grid>
        {/* Product details large images */}
        <Mui.Grid item xs={10} md={5}>
          <Mui.Box
            sx={{
              boxShadow: '1px 1px 5px 1px rgba(200, 200, 200, 0.5)',
              borderRadius: '5px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: product.title,
                  isFluidWidth: true,
                  src: showImg || product.images[0],
                },
                largeImage: {
                  src: showImg || product.images[0],
                  width: 1200,
                  height: 1200,
                },
                lensStyle: { backgroundColor: 'rgba(0,0,0,.5)' },
                shouldUsePositiveSpaceLens: true,
                isHintEnabled: true,
                enlargedImageContainerDimensions: {
                  width: '120%',
                  height: '100%',
                },
              }}
            >
              <Image
                src={showImg || product.images[0]}
                alt={product.title}
                width={500}
                height={500}
                style={{ borderRadius: '5px' }}
                priority
              />
            </ReactImageMagnify>
          </Mui.Box>
        </Mui.Grid>
        {/* Product details description */}
        <Mui.Grid item xs={12} sm={6}>
          <Mui.List>
            {/* <Mui.ListItem> */}
            <Mui.Typography component="h2" variant="h6">
              {product.title}
            </Mui.Typography>
            {/* </Mui.ListItem> */}
            {/* <Mui.ListItem> */}
            <Mui.ListItemText>
              <strong>Short description: </strong>
              {product.shortDescription}
            </Mui.ListItemText>
            {/* </Mui.ListItem> */}
            {/* <Mui.ListItem> */}
            <Mui.ListItemText sx={{ marginTop: '10px' }}>
              <strong>Category: </strong>
              {product?.categories?.name}
            </Mui.ListItemText>
            {/* </Mui.ListItem> */}
            {/* <Mui.ListItem> */}
            <Mui.ListItemText sx={{ marginTop: '10px' }}>
              <strong>Status: </strong>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </Mui.ListItemText>
            {/* </Mui.ListItem> */}
            {/* <Mui.ListItem> */}
            <Mui.ListItemText sx={{ marginTop: '10px' }}>
              <strong>Brand: </strong>
              {product.brand}
            </Mui.ListItemText>
            {/* </Mui.ListItem> */}
            <Mui.Box
              sx={{ display: 'flex', alignItems: 'start', marginTop: '10px' }}
            >
              <strong style={{ marginRight: '10px' }}>Rating: </strong>
              <StarRating rating={product?.totalRating} starSize="18px" />
              <small>({`${product?.numReviews || 0} ratings`})</small>
            </Mui.Box>
            {/* <Mui.ListItem> */}
            <Mui.ListItemText sx={{ marginTop: '10px' }}>
              <strong>Quantity: </strong>
              <Mui.Select
                value={qty}
                size="small"
                onChange={event => cartQuantityHandler(event.target.value)}
              >
                {[...Array(product.countInStock).keys()].map(item => (
                  <Mui.MenuItem key={uuidv4()} value={item + 1}>
                    {item + 1}
                  </Mui.MenuItem>
                ))}
              </Mui.Select>
            </Mui.ListItemText>
            {/* </Mui.ListItem> */}
            {/* <Mui.ListItem> */}
            <Mui.ListItemText sx={{ marginTop: '10px' }}>
              <strong>Price: </strong>${product.price}
            </Mui.ListItemText>
            <Divider />
            {/* </Mui.ListItem> */}
            {/* <Mui.ListItem> */}
            <Mui.Box sx={{ marginTop: '10px' }}>
              <Mui.Button
                onClick={handleAddToCart}
                variant="contained"
                color="primary"
                disabled={product.countInStock <= 0}
              >
                Add to Cart
              </Mui.Button>
              <Mui.Button
                variant="contained"
                color="secondary"
                disabled={product.countInStock <= 0}
                sx={{ marginLeft: '15px' }}
              >
                <MuiIcon.FavoriteBorderIcon />
              </Mui.Button>
            </Mui.Box>

            {/* </Mui.ListItem> */}
          </Mui.List>
        </Mui.Grid>
      </Mui.Grid>
      {/* Product details section ENDS */}

      {/* ######### 3 section of tab panel STARTS ######### */}
      {/* Description, Reviews, TAB3 */}
      <Mui.Box sx={{ marginTop: '30px' }}>
        <Mui.TabContext value={val}>
          {/* ######### Tab header STARTS ########## */}
          <Mui.Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Mui.TabList
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Mui.Tab
                icon={<MuiIcon.DescriptionIcon />}
                iconPosition="start"
                label="Description"
                value="1"
              />
              <Mui.Tab
                icon={<MuiIcon.AssistantIcon />}
                iconPosition="start"
                label={`Reviews(${product.numReviews || 0})`}
                value="2"
              />
              <Mui.Tab label="Tab 3" value="3" />
            </Mui.TabList>
          </Mui.Box>
          {/* ########### Tab header ENDS ########### */}
          {/* Review tab details STARTS */}
          <Mui.TabPanel value="1">
            {ReactHtmlParser(product.description)}
          </Mui.TabPanel>

          <Mui.TabPanel value="2">
            <>
              {/* Show the review form if user already */}
              {/* logged in and not review yet */}
              {!userReviewed ? (
                userToken?.token ? (
                  // Review form
                  <Mui.Box
                    component="form"
                    sx={{ minWidth: 320, maxWidth: 480 }}
                    onSubmit={handleSubmit(reviewSubmitHandle)}
                  >
                    <Mui.Typography variant="h6">Write a review</Mui.Typography>
                    <Mui.List>
                      <Mui.ListItem>
                        <Mui.TextField
                          {...register('reviewName', {
                            required: true,
                            minLength: 5,
                            maxLength: 30,
                          })}
                          fullWidth
                          inputProps={{ type: 'text' }}
                          label="Name"
                          name="reviewName"
                          placeholder="John Doe"
                          size="small"
                          helperText={
                            errors?.reviewName?.type === 'required'
                              ? 'Name is required'
                              : errors?.reviewName?.type === 'minLength'
                              ? 'Insert at least 5 characters'
                              : errors?.reviewName?.type === 'maxLength'
                              ? "Don't exceed 30 characters"
                              : null
                          }
                        />
                      </Mui.ListItem>

                      <Mui.ListItem>
                        <Mui.TextField
                          {...register('comment', {
                            required: true,
                            minLength: 5,
                            maxLength: 200,
                          })}
                          fullWidth
                          multiline
                          name="comment"
                          inputProps={{ type: 'textarea' }}
                          label="Your Review"
                          placeholder="Write review here..."
                          size="small"
                          helperText={
                            errors?.comment?.type === 'required'
                              ? 'Review is required'
                              : errors?.comment?.type === 'minLength'
                              ? 'Insert at least 5 characters'
                              : errors?.comment?.type === 'maxLength'
                              ? "Don't exceed 200 characters"
                              : null
                          }
                        />
                      </Mui.ListItem>
                      <Mui.ListItem>
                        <Mui.FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                        >
                          <Mui.InputLabel>Select a rating</Mui.InputLabel>
                          <Mui.Select
                            {...register('ratingStar', {
                              required: {
                                value: true,
                                message: 'Select one option',
                              },
                            })}
                            id="select-rating"
                            size="small"
                            name="ratingStar"
                            label="Select a rating"
                            value={rating}
                            renderValue={() => rating}
                            onChange={handleRating}
                          >
                            {[1, 2, 3, 4, 5].map(item => (
                              <Mui.MenuItem
                                id="select-rating"
                                key={uuidv4()}
                                value={item}
                              >
                                {item}
                              </Mui.MenuItem>
                            ))}
                          </Mui.Select>
                          <Mui.FormHelperText>
                            {errors?.ratingStar && errors?.ratingStar?.message}
                          </Mui.FormHelperText>
                        </Mui.FormControl>
                      </Mui.ListItem>
                      <Mui.ListItem>
                        <Mui.Button
                          type="submit"
                          size="small"
                          variant="contained"
                          color="success"
                        >
                          Add Review
                        </Mui.Button>
                      </Mui.ListItem>
                    </Mui.List>
                  </Mui.Box>
                ) : (
                  // If the user not login, then prompt user to login
                  <Mui.Box>
                    <Mui.Typography>
                      Login first to submit a review
                      <Link href="/login">
                        <Mui.Button
                          sx={{ marginLeft: '15px' }}
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          Login
                        </Mui.Button>
                      </Link>
                    </Mui.Typography>
                  </Mui.Box>
                )
              ) : (
                // if the user already reviewed, then show thanks message
                <Mui.Typography variant="h6" component="h6">
                  Thanks for your valuable review.
                </Mui.Typography>
              )}

              {/* LOAD the product review */}
              {/* For loading product review not depend on user login */}
              <Mui.Box sx={{ minWidth: '320px', maxWidth: '480px' }}>
                {loadRating ? (
                  <Mui.CircularProgress size="3rem" />
                ) : error ? (
                  <Mui.Alert variant="error">error</Mui.Alert>
                ) : Array.isArray(product.reviews) &&
                  product.reviews?.length > 0 ? (
                  <>
                    {product.reviews.slice(0, reviewsToShow)?.map(item => (
                      <Mui.Paper key={uuidv4()} sx={{ marginTop: '15px' }}>
                        <Mui.Card>
                          <Mui.CardHeader
                            action={<StarRating rating={item?.rating} />}
                            avatar={
                              <Mui.Avatar sx={{ backgroundColor: 'green' }}>
                                {item?.name?.toUpperCase().slice(0, 1)}
                              </Mui.Avatar>
                            }
                            title={item.name}
                            subheader={convertDate(item.postedDate)}
                          />
                          <Mui.CardContent>
                            <Mui.Typography variant="body2">
                              "{item?.comment}"
                            </Mui.Typography>
                          </Mui.CardContent>
                        </Mui.Card>
                      </Mui.Paper>
                    ))}
                    {/* Button for showing review items if the number is greater than 5 */}
                    {product.reviews.length > reviewsToShow ? (
                      <Mui.Button
                        size="small"
                        variant="contained"
                        onClick={handleToShow}
                        sx={{ marginTop: '30px' }}
                      >
                        Show More Reviews
                      </Mui.Button>
                    ) : null}
                  </>
                ) : (
                  <Mui.Typography
                    variant="body1"
                    sx={{
                      marginTop: '30px',
                      borderTop: '1px solid lightgrey',
                      paddingTop: '10px',
                    }}
                  >
                    No Comments Available to show...
                  </Mui.Typography>
                )}
              </Mui.Box>
            </>
          </Mui.TabPanel>
          {/* Review tab details ENDS */}
          <Mui.TabPanel value="3">Panel 3</Mui.TabPanel>
        </Mui.TabContext>
      </Mui.Box>

      {/* #### 3 section of tab panel ENDS #### */}

      {/* Related products */}
      <Mui.Box>
        <RelatedProducts product={product} />
      </Mui.Box>

      {/* Recently viewed products */}
      <Mui.Box sx={{ marginTop: '60px' }}>
        <Mui.Typography variant="h1">Recently Viewed Products</Mui.Typography>
        <Mui.Grid container spacing={2}>
          {filteredProducts &&
            filteredProducts.length > 0 &&
            filteredProducts?.map(item => (
              <Mui.Grid item key={uuidv4()} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={item} />
              </Mui.Grid>
            ))}
        </Mui.Grid>
      </Mui.Box>
    </Layout>
  );
};

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug })
    .populate('categories', 'name')
    .lean();
  // await db.disconnect();

  // Cloudinary image fetching
  const imagePromise = product.images.map(async file => {
    const cloudPromise = await viewCloudinaryImage(file);
    return cloudPromise;
  });
  const updatedImages = await Promise.all(imagePromise);
  product.images = updatedImages;

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product: product
        ? JSON.parse(JSON.stringify(await db.convertDocToObj(product)))
        : {},
    },
  };
}
