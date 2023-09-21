import dynamic from 'next/dynamic';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Mui from '../../components/muiImportComponents/ProductMUI';
import styles from '../../styles/account.module.css';
import TinyMCE from '../../utils/TinyMCE';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import { getError } from '../../utils/error';

const Layout = dynamic(() => import('../../components/Layout'));

const Create = () => {
  const [catOptions, setCatOptions] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  // image preview in the form
  const [imgFile, setImgFile] = useState([]);
  const [shipping, setShipping] = useState('');

  const [descriptionError, setDescriptionError] = useState('');
  // const [editorTouched, setEditorTouched] = useState(false);

  const router = useRouter();
  // React context api
  const [{ userInfo, tinymceText }] = useStateValue();

  const {
    control,
    handleSubmit,
    setValue,
    register,
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
      // if image format checking
      const imgTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (imgTypes.includes(images[i].type)) {
        imgObjURL.push(imgURL);
      }
    }
    if (imgFile && imgFile.length > 0) {
      imgFile.length = 0;
    }
    setImgFile([...imgFile, ...imgObjURL]);
  };

  // ########## SUBMIT HANDLER STARTS ###########
  // Form submit handler
  // eslint-disable-next-line consistent-return
  const productSubmitHandler = async productData => {
    const images = productData.avatar;
    const {
      title,
      shortDescription,
      editorContent,
      brand,
      color,
      countInStock,
      numReviews,
      price,
      size,
      sold,
    } = productData;

    // ########## TINYMCE EDITOR ##########
    // remove the html tag from the string
    // then count the word number
    const regex = new RegExp(/<([^>]+)>/, 'gi');
    const str = editorContent?.replace(regex, '');
    const tinymceWordsCount = str?.trim().split(' ');

    console.log('WORDS COUNT TINYMCE ==> ', tinymceWordsCount);

    // setEditorTouched(true);
    if (tinymceWordsCount.length < 5) {
      setDescriptionError('Insert atleast 5 words!');
      return true;
    }

    if (tinymceWordsCount.length > 1000) {
      setDescriptionError('Description should not exceed 1000 words!');
      return true;
    }

    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('color', color);
    formData.append('countInStock', countInStock);
    formData.append('description', editorContent);
    formData.append('category', selectedCat._id);
    formData.append('numReviews', numReviews);
    formData.append('price', price);
    formData.append('title', title);
    formData.append('shipping', shipping);
    formData.append('shortDescription', shortDescription);
    formData.append('size', size);
    formData.append('sold', sold);

    for (let i = 0; i < images.length; i++) {
      formData.append('avatar', images[i]);
    }

    try {
      const { data } = await axios.post('/api/products/create', formData, {
        headers: { authorization: `Bearer ${userToken?.token}` },
      });

      // console.log('DATA IN CLIENT ==> ', data);

      if (data && typeof data.message !== 'undefined') {
        setImgFile([]);
        toast.success(data.message, {
          position: 'top-center',
          autoClose: 1000,
        });
        setTimeout(() => {
          router.push('/product/view');
        }, 500);
      } else {
        // toast.error(data.errMessage, {
        //   position: 'top-center',
        //   autoClose: 1000,
        // });
        throw new Error(data.errMessage);
      }
    } catch (err) {
      toast.error(err.message, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 1000,
      });
    }
  };

  // ########## SUBMIT HANDLER ENDS ###########

  // Checkbox handler functions
  const checkYesHandler = () => {
    shipping === 'Yes' ? setShipping('') : setShipping('Yes');
  };

  const checkNoHandler = () => {
    shipping === 'No' ? setShipping('') : setShipping('No');
  };

  useEffect(() => {
    setValue('editorContent', tinymceText);
  }, [setValue, tinymceText]);

  // To show categories from database as dropdown
  useEffect(() => {
    // const isCancelled = useRef(false);
    // if (!isCancelled.current) {
    if (!userToken) {
      router.push('/login');
    }
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/category/view', {
          headers: { authorization: `Bearer ${userToken.token}` },
        });
        setCatOptions(data);
      } catch (err) {
        toast.error(getError(err), {
          position: 'top-center',
          theme: 'colored',
          autoClose: 2000,
        });
      }
    };
    fetchCategories();
    // }
    // return () => {
    //   isCancelled.current = true;
    // };
  }, [userToken, setCatOptions, router]);

  return (
    <Layout title="Product create" description="Product create page">
      <Mui.Typography variant="h1" textAlign="center">
        Create Product
      </Mui.Typography>
      <Mui.Paper className={styles.formLogin}>
        <Mui.Box textAlign="right">
          <Link href="/product/view">
            <Mui.Button variant="contained" size="small">
              View Products
            </Mui.Button>
          </Link>
        </Mui.Box>
        <Mui.Box component="form" onSubmit={handleSubmit(productSubmitHandler)}>
          <Mui.List>
            {/* Product title */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('title', {
                  required: true,
                  minLength: 5,
                  maxLength: 80,
                })}
                inputProps={{ type: 'text' }}
                placeholder="Product Title"
                label="Product Title"
                name="title"
                variant="outlined"
                size="small"
                color={errors.title ? 'error' : 'success'}
                fullWidth
                helperText={
                  errors?.title?.type === 'required'
                    ? 'should not be empty'
                    : errors?.title?.type === 'minLength'
                    ? 'At least 5 characters'
                    : errors?.title?.type === 'maxLength'
                    ? 'Do not exceed 50 characters'
                    : ''
                }
              />
            </Mui.ListItem>

            {/* Short Description */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('shortDescription', {
                  required: true,
                  minLength: 5,
                  maxLength: 200,
                })}
                inputProps={{ type: 'text' }}
                placeholder="Short Description"
                label="Short Description"
                name="shortDescription"
                variant="outlined"
                color={errors.shortDescription ? 'error' : 'success'}
                size="small"
                fullWidth
                helperText={
                  errors.shortDescription?.type === 'required'
                    ? 'should not be empty'
                    : errors.shortDescription?.type === 'minLength'
                    ? 'At least 5 characters'
                    : errors.shortDescription?.type === 'maxLength'
                    ? 'Do not exceed 200 characters'
                    : ''
                }
              />
            </Mui.ListItem>

            {/* Description ==> tinyMCE editor */}
            <Mui.ListItem>
              <Mui.Box
                className={descriptionError ? 'warning' : ''}
                sx={{ width: '100%' }}
              >
                <Controller
                  name="editorContent"
                  control={control}
                  render={() => <TinyMCE />}
                />
              </Mui.Box>
            </Mui.ListItem>
            {descriptionError && (
              <Mui.ListItem sx={{ marginBottom: '10px' }}>
                <Mui.Typography
                  variant="caption"
                  marginLeft={2}
                  sx={{ color: 'grey' }}
                >
                  {descriptionError}
                </Mui.Typography>
              </Mui.ListItem>
            )}

            {/* Category */}
            <Mui.ListItem>
              <Mui.Autocomplete
                fullWidth
                options={catOptions}
                getOptionLabel={option => {
                  // setCatId(option._id);
                  return option.name;
                }}
                value={selectedCat}
                onChange={(event, newValue) => setSelectedCat(newValue)}
                renderInput={params => (
                  <Mui.TextField
                    name="category"
                    {...register('category', {
                      required: true,
                    })}
                    label="Select a category"
                    {...params}
                    helperText={
                      errors?.category?.type === 'required'
                        ? 'Select at least one category from dropdown'
                        : null
                    }
                  />
                )}
              />
            </Mui.ListItem>

            {/* show product image preview */}
            {imgFile.length > 0 ? (
              <Mui.ImageList
                sx={{
                  width: '260px',
                  height: 'auto',
                  marginLeft: '15px',
                }}
                cols={5}
              >
                {imgFile.map(image => (
                  <Mui.ImageListItem key={image}>
                    <Image
                      src={image}
                      alt={image}
                      width={40}
                      height={40}
                      style={{
                        borderRadius: '2px',
                        border: '1px solid rgb(230, 230, 230)',
                        boxShadow: '0 0 6px 1px lightgrey',
                      }}
                      priority
                    />
                  </Mui.ImageListItem>
                ))}
              </Mui.ImageList>
            ) : null}

            {/* Image file */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('avatar', {
                  required: {
                    value: imgFile.length < 1,
                    message: 'Insert at least one picture',
                  },
                  validate: {
                    lessThan10MB: files =>
                      files[0].size < 10485760 || 'Max size is 10MB',
                    acceptedFormats: files =>
                      files.length < 1 ||
                      ['image/png', 'image/jpg', 'image/jpeg'].includes(
                        files[0].type
                      ) ||
                      'Accepted image formats are png, jpg, & jpeg',
                  },
                })}
                inputProps={{ type: 'file', multiple: true }}
                name="avatar"
                onChange={fileUploadHandler}
                fullWidth
                size="small"
                accept="image/*"
                helperText={errors?.avatar && errors?.avatar.message}
              />
            </Mui.ListItem>

            {/* Shipping  */}
            <Mui.ListItem>
              <Mui.Typography variant="body1">Shipping: &nbsp; </Mui.Typography>
              <Mui.FormControlLabel
                {...register('shipping', { required: true })}
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
                {...register('shipping', { required: true })}
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
            </Mui.ListItem>

            {/* Error message if shipping is not selected */}
            {errors?.shipping?.type === 'required' ? (
              <Mui.Typography
                style={{
                  fontSize: '12px',
                  paddingLeft: '20px',
                  color: 'grey',
                  marginBottom: '10px',
                }}
                variant="subtitle1"
              >
                Check at least one option!
              </Mui.Typography>
            ) : null}

            {/* Price */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('price', {
                  required: true,
                  minLength: 1,
                  maxLength: 8,
                  pattern: /^[+-]?\d+(\.\d+)?$/g,
                })}
                inputProps={{ step: 0.01 }}
                type="number"
                placeholder="Only Numbers"
                label="Price"
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
                    : ''
                }
              />
            </Mui.ListItem>

            {/* Color */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('color', {
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
                inputProps={{ type: 'text' }}
                placeholder="Only Text"
                label="Color"
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
                    : ''
                }
              />
            </Mui.ListItem>

            {/* Brand */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('brand', {
                  required: true,
                  minLength: 2,
                  maxLength: 30,
                })}
                inputProps={{ type: 'text' }}
                placeholder="Only Text"
                label="Brand"
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
                    : ''
                }
              />
            </Mui.ListItem>

            {/* Size */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('size', {
                  required: true,
                  minLength: 2,
                  maxLength: 30,
                })}
                inputProps={{ type: 'text' }}
                placeholder="Only Text"
                label="Size"
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
                    : ''
                }
              />
            </Mui.ListItem>

            {/* Count in stock */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('countInStock', {
                  required: true,
                  minLength: 1,
                  maxLength: 5,
                  pattern: /[0-9]/g,
                })}
                inputProps={{ type: 'number' }}
                placeholder="Only Numbers"
                label="Count In Stock"
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
                    : ''
                }
              />
            </Mui.ListItem>

            {/* Sold */}
            <Mui.ListItem>
              <Mui.TextField
                {...register('sold', {
                  required: true,
                  minLength: 1,
                  maxLength: 5,
                  pattern: /[0-9]/g,
                })}
                inputProps={{ type: 'number' }}
                placeholder="Only Numbers"
                label="Sold"
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
                    : ''
                }
              />
            </Mui.ListItem>
            {/* Form submit button */}
            <Mui.ListItem>
              <Mui.Button type="submit" variant="contained" fullWidth>
                Create Product
              </Mui.Button>
            </Mui.ListItem>
          </Mui.List>
        </Mui.Box>
      </Mui.Paper>
    </Layout>
  );
};

export default Create;
