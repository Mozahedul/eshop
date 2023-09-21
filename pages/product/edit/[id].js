import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Mui from '../../../components/muiImportComponents/ProductMUI';
import * as MuiIcon from '../../../components/muiImportComponents/MUIIcons';
import Layout from '../../../components/Layout';
import styles from '../../../styles/account.module.css';
import { useStateValue } from '../../../utils/contextAPI/StateProvider';
import { getError } from '../../../utils/error';

const Edit = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [catId, setCatId] = useState(null);
  // image preview in the form
  const [imgArr, setImgArr] = useState([]);
  console.log('IMAGES ==> ', imgArr);
  const [shipping, setShipping] = useState('');
  const [removeProductImg, setRemoveProductImg] = useState([]);
  const router = useRouter();
  const routerId = router.query.id;
  const [{ userInfo }, dispatch] = useStateValue();

  // react-hook-form
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  // user token from cookie and state
  // Get userInfo from cookie
  const userCookie = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';
  const userToken = userInfo || userCookie;

  // onChange image file handler
  const fileUploadHandler = event => {
    // return multiple images as an object format
    const images = event.target.files;

    const imgObjURL = [];
    for (let i = 0; i < images.length; i++) {
      const imgURL = URL.createObjectURL(images[i]);
      const arrImage = ['image/png', 'image/jpg', 'image/jpeg'];
      if (arrImage.includes(images[i].type)) {
        imgObjURL.push(imgURL);
      }
    }
    setImgArr([...imgArr, ...imgObjURL]);
  };

  // Form submit handler
  const productSubmitHandler = async productData => {
    // Catch data from form
    const images = productData.avatar;
    const {
      title,
      shortDescription,
      brand,
      color,
      countInStock,
      description,
      numReviews,
      price,
      size,
      sold,
    } = productData;

    // Processing images of a form
    const formData = new FormData();
    for (let i = 0; i < images?.length; i++) {
      formData.append('avatar', images[i]);
    }

    try {
      if (routerId) {
        // Send images to backend to process with multer
        const { data } = await axios.post(
          '/api/products/edit/image-process',
          formData,
          {
            headers: { authorization: `Bearer ${userToken?.token}` },
          }
        );

        imgArr.splice(-data.length, data.length);
        const newImages = [...imgArr, ...data];
        setImgArr(newImages);

        const imageObj = {
          title,
          shortDescription,
          description,
          categories: catId,
          price,
          images: newImages,
          shipping,
          color,
          brand,
          size,
          numReviews,
          countInStock,
          sold,
          removeProductImg,
        };

        // console.log('IMAGE OBJECT ==> ', imageObj);

        const { data: productEdit } = await axios.put(
          `/api/products/edit/${routerId}`,
          imageObj,
          {
            headers: { authorization: `Bearer ${userToken.token}` },
          }
        );

        // console.log('PRODUCT EDIT ==> ', productEdit);

        if (productEdit && productEdit.message) {
          setImgArr([]);
          toast.success('Product Updated Successfully', {
            position: 'top-center',
            autoClose: 1000,
          });
          router.push('/product/view');
        } else {
          toast.error(productEdit.errMessage, {
            position: 'top-center',
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      toast.error(getError(error), {
        position: 'top-center',
        autoClose: 2000,
        theme: 'colored',
      });
    }
  };

  // Checkbox handler functions
  const checkYesHandler = () => {
    setShipping('Yes');
  };
  const checkNoHandler = () => {
    setShipping('No');
  };

  // Single product image remove from form image preview
  const handleImageRemove = index => {
    const filteredImg = imgArr.filter(image => imgArr[index] !== image);
    const removedImages = imgArr.slice(index, index + 1);

    setRemoveProductImg([...removeProductImg, ...removedImages]);
    setImgArr(filteredImg);
  };

  useEffect(() => {
    if (!userToken) {
      router.push('/login');
    } else {
      try {
        dispatch({ type: 'PRODUCT_REQUEST' });
        const fetchSingleProduct = async () => {
          const { data } = await axios.get(`/api/products/edit/${routerId}`, {
            headers: { authorization: `Bearer ${userToken}` },
          });

          console.log('DATA FROM PRODUCT EDIT ==> ', data);

          // console.log('PRODUCT DATA => ', data);
          setValue('title', data.title);
          setValue('shortDescription', data.shortDescription);
          setValue('description', data.description);
          setValue('category', data.categories?.name);
          setValue('brand', data.brand);
          setValue('price', data.price);
          setValue('color', data.color);
          setValue('size', data.size);
          setValue('numReviews', data.numReviews);
          setValue('countInStock', data.countInStock);
          setValue('sold', data.sold);
          setShipping(data.shipping);
          setImgArr(data.images);

          setCatId(data.categories?._id);

          setSelectedCat(
            categoryOptions?.find(item => item._id === data.categories?._id)
          );
        };
        fetchSingleProduct();
        dispatch({ type: 'PRODUCT_SUCCESS' });
      } catch (err) {
        console.log(err);
      }
    }
  }, [
    router,
    userToken,
    routerId,
    dispatch,
    setValue,
    setSelectedCat,
    categoryOptions,
  ]);

  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    if (!userToken) {
      router.push('/login');
    }

    const fetchCategories = async () => {
      const { data } = await axios.get('/api/category/view', {
        headers: { authorization: `Bearer ${userToken.token}` },
      });

      const newArr = [];
      data.map(info => {
        newArr.push({
          name: info.categories?.name,
          _id: info.categories?._id,
        });
        return true;
      });
      setCategoryOptions(data);
    };
    fetchCategories();
    // }
    // return () => {
    //   isCancelled.current = true;
    // };
  }, [router, setCategoryOptions, userToken]);

  return (
    <Layout title="Product create" description="Product create page">
      <Mui.Typography variant="h1" textAlign="center">
        Edit Product
      </Mui.Typography>
      <Mui.Paper className={styles.formLogin}>
        <Mui.Box textAlign="right">
          <Link href="/product/view">
            <Mui.Button variant="contained" size="small">
              View Products
            </Mui.Button>
          </Link>
        </Mui.Box>
        <Mui.Box
          component="form"
          onSubmit={handleSubmit(productSubmitHandler)}
          padding="30px"
        >
          <Mui.FormControl fullWidth>
            <Mui.FormLabel>Product Title</Mui.FormLabel>
            {/* <ListItem> */}
            <Mui.TextField
              {...register('title', {
                required: true,
                minLength: 5,
                maxLength: 80,
              })}
              inputProps={{ type: 'text' }}
              name="title"
              variant="outlined"
              size="small"
              color={errors.title ? 'error' : 'success'}
              helperText={
                errors.title?.type === 'required'
                  ? 'should not be empty'
                  : errors.title?.type === 'minLength'
                  ? 'At least 5 characters'
                  : errors.title?.type === 'maxLength'
                  ? 'Do not exceed 80 characters'
                  : null
              }
            />
          </Mui.FormControl>

          {/* Short Description */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Short Description</Mui.FormLabel>
            <Mui.TextField
              {...register('shortDescription', {
                required: true,
                minLength: 5,
                maxLength: 200,
              })}
              inputProps={{ type: 'text' }}
              name="shortDescription"
              variant="outlined"
              color={errors.shortDescription ? 'error' : 'success'}
              size="small"
              helperText={
                errors.shortDescription?.type === 'required'
                  ? 'should not be empty'
                  : errors.shortDescription?.type === 'minLength'
                  ? 'At least 5 characters'
                  : errors.shortDescription?.type === 'maxLength'
                  ? 'Do not exceed 200 characters'
                  : null
              }
            />
          </Mui.FormControl>

          {/* Description */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Description</Mui.FormLabel>
            <Mui.TextField
              {...register('description', {
                required: true,
                minLength: 5,
                maxLength: 5000,
              })}
              inputProps={{ type: 'text' }}
              name="description"
              variant="outlined"
              color={errors.description ? 'error' : 'success'}
              size="small"
              helperText={
                errors.description?.type === 'required'
                  ? 'should not be empty'
                  : errors.description?.type === 'minLength'
                  ? 'At least 5 characters'
                  : errors.description?.type === 'maxLength'
                  ? 'Do not exceed 5000 characters'
                  : null
              }
            />
          </Mui.FormControl>

          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Category</Mui.FormLabel>
            <Mui.Autocomplete
              options={categoryOptions}
              getOptionLabel={option => option.name}
              value={selectedCat || null}
              defaultValue={selectedCat || null}
              onChange={(event, newValue) => {
                setCatId(newValue?._id);
                setSelectedCat(newValue);
              }}
              isOptionEqualToValue={(option, value) => {
                if (value === '' || value === option) return true;
                return true;
              }}
              renderInput={params => (
                <Mui.TextField
                  {...params}
                  name="category"
                  {...register('category', { required: true })}
                />
              )}
            />
          </Mui.FormControl>

          {/* show product image preview */}
          {imgArr?.length > 0 ? (
            <Mui.ImageList
              sx={{
                width: '260px',
                height: 'auto',
                marginBottom: '-5px',
              }}
              cols={5}
            >
              {imgArr?.map((image, index) => (
                <Mui.ImageListItem key={image}>
                  <Image
                    src={image}
                    alt={image}
                    width={40}
                    height={40}
                    style={{
                      marginRight: '4px',
                      borderRadius: '2px',
                      border: '1px solid rgb(230, 230, 230)',
                    }}
                    priority
                  />
                  <Mui.IconButton
                    onClick={() => handleImageRemove(index)}
                    color="warning"
                    sx={{
                      position: 'absolute',
                      top: '-4px',
                      left: '-4px',
                      backgroundColor: '#fff',
                      padding: '3px',
                      fontSize: '14px',
                      boxShadow: '1px 1px 3px 1px rgba(150, 150, 150, 0.5)',
                    }}
                  >
                    <MuiIcon.CloseIcon fontSize="4px" />
                  </Mui.IconButton>
                </Mui.ImageListItem>
              ))}
            </Mui.ImageList>
          ) : null}

          {/* Image file */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Image</Mui.FormLabel>
            <Mui.TextField
              {...register('avatar', {
                required: {
                  value: imgArr?.length < 1,
                  message: 'Insert at least one picture',
                },
                validate: {
                  lessThan10MB: files =>
                    imgArr?.length > 0 && files.length > 0
                      ? files[0].size < 10485760
                      : imgArr?.length < 1 && files.length > 0
                      ? files[0].size < 10485760
                      : imgArr?.length > 0 && files.length < 1
                      ? true
                      : 'Image must be less than 10MB',
                  acceptedFormats: files =>
                    files.length < 1 ||
                    ['image/png', 'image/jpg', 'image/jpeg'].includes(
                      files[0].type
                    ) ||
                    'Accepted formats are png, jpg, & jpeg',
                },
              })}
              inputProps={{ type: 'file', multiple: true }}
              name="avatar"
              onChange={fileUploadHandler}
              size="small"
              accept="image/*"
              helperText={errors?.avatar && errors?.avatar.message}
            />
          </Mui.FormControl>

          {/* Shipping  */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Shipping: &nbsp; </Mui.FormLabel>
            <Mui.FormControlLabel
              {...register('shipping', {
                required: { value: shipping?.length < 1 },
              })}
              label="Yes"
              name="shipping"
              control={
                <Mui.Checkbox
                  checked={shipping === 'Yes'}
                  onChange={checkYesHandler}
                  value={shipping}
                />
              }
            />
            <Mui.FormControlLabel
              {...register('shipping', {
                required: { value: shipping?.length < 1 },
              })}
              label="No"
              name="shipping"
              control={
                <Mui.Checkbox
                  checked={shipping === 'No'}
                  onChange={checkNoHandler}
                  value={shipping}
                />
              }
            />
          </Mui.FormControl>
          {/* Error message if shipping is not selected */}
          {!shipping?.length && errors.shipping?.type === 'required' ? (
            <Mui.Typography
              style={{
                fontSize: '12px',
                paddingLeft: '20px',
                color: 'grey',
              }}
              variant="subtitle1"
            >
              Check at least one option
            </Mui.Typography>
          ) : null}

          {/* Price */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Price</Mui.FormLabel>
            <Mui.TextField
              {...register('price', {
                required: true,
                minLength: 1,
                maxLength: 8,
                pattern: /[0-9]/g,
              })}
              inputProps={{ step: 0.01 }}
              type="number"
              name="price"
              color={errors.price ? 'error' : 'success'}
              variant="outlined"
              size="small"
              fullWidth
              helperText={
                errors.price?.type === 'required'
                  ? 'should not be empty'
                  : errors.price?.type === 'pattern'
                  ? 'Input only numbers'
                  : errors.price?.type === 'minLength'
                  ? 'Insert at least one digit'
                  : errors.price?.type === 'maxLength'
                  ? 'Exceed the max digit!'
                  : null
              }
            />
          </Mui.FormControl>
          {/* Color */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Color</Mui.FormLabel>
            <Mui.TextField
              {...register('color', {
                required: true,
                minLength: 3,
                maxLength: 20,
              })}
              inputProps={{ type: 'text' }}
              name="color"
              color={errors.color ? 'error' : 'success'}
              variant="outlined"
              size="small"
              fullWidth
              helperText={
                errors.color?.type === 'required'
                  ? 'should not be empty'
                  : errors.color?.type === 'minLength'
                  ? 'At least 3 characters'
                  : errors.color?.type === 'maxLength'
                  ? 'Do not exceed 50 characters'
                  : null
              }
            />
          </Mui.FormControl>
          {/* Brand */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Brand</Mui.FormLabel>
            <Mui.TextField
              {...register('brand', {
                required: true,
                minLength: 2,
                maxLength: 30,
              })}
              inputProps={{ type: 'text' }}
              name="brand"
              variant="outlined"
              color={errors.brand ? 'error' : 'success'}
              size="small"
              fullWidth
              helperText={
                errors.brand?.type === 'required'
                  ? 'should not be empty'
                  : errors.brand?.type === 'minLength'
                  ? 'At least 2 characters'
                  : errors.brand?.type === 'maxLength'
                  ? 'Do not exceed maximum characters'
                  : null
              }
            />
          </Mui.FormControl>
          {/* Size */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Size</Mui.FormLabel>
            <Mui.TextField
              {...register('size', {
                required: true,
                minLength: 2,
                maxLength: 30,
              })}
              inputProps={{ type: 'text' }}
              name="size"
              variant="outlined"
              size="small"
              color={errors.size ? 'error' : 'success'}
              fullWidth
              helperText={
                errors.size?.type === 'required'
                  ? 'should not be empty'
                  : errors.size?.type === 'minLength'
                  ? 'At least 5 characters'
                  : errors.size?.type === 'maxLength'
                  ? 'Do not exceed 50 characters'
                  : null
              }
            />
          </Mui.FormControl>

          {/* Count in stock */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Count in Stock</Mui.FormLabel>
            <Mui.TextField
              {...register('countInStock', {
                required: true,
                minLength: 1,
                maxLength: 5,
                pattern: /[0-9]/g,
              })}
              inputProps={{ type: 'number' }}
              name="countInStock"
              variant="outlined"
              size="small"
              color={errors.countInStock ? 'error' : 'success'}
              fullWidth
              helperText={
                errors.countInStock?.type === 'required'
                  ? 'should not be empty'
                  : errors.countInStock?.type === 'pattern'
                  ? 'Input only numbers'
                  : errors.countInStock?.type === 'minLength'
                  ? 'Insert at least 1 digit'
                  : errors.countInStock?.type === 'maxLength'
                  ? "Don't exceed 5 digit"
                  : null
              }
            />
          </Mui.FormControl>
          {/* Sold */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.FormLabel>Sold</Mui.FormLabel>
            <Mui.TextField
              {...register('sold', {
                required: true,
                minLength: 1,
                maxLength: 5,
                pattern: /[0-9]/g,
              })}
              inputProps={{ type: 'number' }}
              name="sold"
              variant="outlined"
              size="small"
              color={errors.sold ? 'error' : 'success'}
              fullWidth
              helperText={
                errors.sold?.type === 'required'
                  ? 'should not be empty'
                  : errors.sold?.type === 'pattern'
                  ? 'Input only numbers'
                  : errors.sold?.type === 'minLength'
                  ? 'Insert at least 1 digit'
                  : errors.sold?.type === 'maxLength'
                  ? "Don't exceed 5 digit"
                  : null
              }
            />
          </Mui.FormControl>
          {/* Form submit button */}
          <Mui.FormControl fullWidth sx={{ marginTop: '15px' }}>
            <Mui.Button type="submit" variant="contained">
              Update Product
            </Mui.Button>
          </Mui.FormControl>
        </Mui.Box>
      </Mui.Paper>
    </Layout>
  );
};

export default Edit;
