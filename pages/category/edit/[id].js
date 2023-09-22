import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Mui from '../../../components/muiImportComponents/CategoryMUI';
import Layout from '../../../components/Layout';
import styles from '../../../styles/account.module.css';
import { useStateValue } from '../../../utils/contextAPI/StateProvider';
import { getError } from '../../../utils/error';

const Edit = () => {
  const [images, setImages] = useState([]);
  const [removedCatImage, setRemovedCatImage] = useState([]);
  // console.log('IMAGES ==> ', images);
  const router = useRouter();
  const [{ userInfo }] = useStateValue();
  const categoryId = router.query.id;
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  // user info taken from cookies
  const userInfoCookie = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';

  const userToken = userInfo || userInfoCookie;

  // edit category form
  const editCategoryHandle = async categories => {
    const formData = new FormData();

    for (let i = 0; i < categories.catImages.length; i++) {
      formData.append('catImages', categories.catImages[i]);
    }

    try {
      if (categoryId) {
        const { data: cloudImgArr } = await axios.post(
          '/api/category/edit/image-process',
          formData,
          { headers: { authorization: `Bearer ${userToken.token}` } }
        );

        // replace locally added image with multer processed image
        images.splice(-cloudImgArr.length, cloudImgArr.length);
        // combine two array 1. db image 2. multer processed image
        const newCategory = [...images, ...cloudImgArr];
        setImages(newCategory);

        const catObj = {
          category: categories.category,
          description: categories.description,
          image: newCategory,
          removedCatImage,
        };

        const { data } = await axios.put(
          `/api/category/edit/${categoryId}`,
          catObj,
          {
            headers: { authorization: `Bearer ${userToken.token}` },
          }
        );

        if (data && data.message) {
          setImages([]);
          toast.success(data.message, {
            position: 'top-center',
            theme: 'colored',
            autoClose: 1000,
          });
          setTimeout(() => {
            router.push('/category/view');
          }, 500);
        } else {
          toast.error('Category update failed');
        }
      }
    } catch (err) {
      toast.error(err);
    }
  };

  // onChange file handler
  const changeFileHandle = event => {
    const imageChange = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const localImg = URL.createObjectURL(event.target.files[i]);
      imageChange.push(localImg);
    }
    setImages([...images, ...imageChange]);
  };

  // remove image from form
  const imageRemoveHandle = index => {
    const newImages = images.filter(image => image !== images[index]);
    const slicedImages = images.slice(index, index + 1);

    setRemovedCatImage([...removedCatImage, ...slicedImages]);
    setImages(newImages);
  };

  useEffect(() => {
    if (!userToken) {
      router.push('/login');
    } else {
      try {
        const fetchCategory = async () => {
          const { data } = await axios.get(`/api/category/edit/${categoryId}`, {
            headers: { authorization: `Bearer ${userToken.token}` },
          });
          setValue('category', data.name);
          setValue('description', data.description);
          setImages(data.image);
        };
        if (categoryId) {
          fetchCategory();
        }
      } catch (error) {
        console.log(getError(error));
      }
    }
  }, [userToken, categoryId, router, setValue]);

  return (
    <Layout>
      <Mui.Typography variant="h2" sx={{ textAlign: 'center' }}>
        Update Category
      </Mui.Typography>

      <Mui.Paper className={styles.formLogin}>
        <Mui.Box align="right">
          <Link href="/category/view">
            <Mui.Button variant="contained" size="small">
              View Categories
            </Mui.Button>
          </Link>
        </Mui.Box>
        <Mui.Box component="form" onSubmit={handleSubmit(editCategoryHandle)}>
          <Mui.List>
            <Mui.ListItem>
              <Mui.InputLabel>Category Name</Mui.InputLabel>
            </Mui.ListItem>
            <Mui.ListItem>
              <Mui.TextField
                {...register('category', {
                  required: true,
                  minLength: 5,
                  maxLength: 24,
                })}
                inputProps={{ type: 'text' }}
                name="category"
                variant="outlined"
                size="small"
                fullWidth
                helperText={
                  errors?.category?.type === 'required'
                    ? 'Category should not be empty'
                    : errors?.category?.type === 'minLength'
                    ? 'Insert at least 5 characters'
                    : errors?.category?.type === 'maxLength'
                    ? 'Do not exceed more than 24 characters'
                    : ''
                }
              />
            </Mui.ListItem>
            <Mui.ListItem>
              <Mui.TextField
                {...register('description', {
                  required: true,
                  minLength: 5,
                  maxLength: 120,
                })}
                inputProps={{ type: 'text' }}
                name="description"
                variant="outlined"
                size="small"
                fullWidth
                helperText={
                  errors?.description?.type === 'required'
                    ? 'description should not be empty'
                    : errors?.description?.type === 'minLength'
                    ? 'Insert at least 5 characters'
                    : errors?.description?.type === 'maxLength'
                    ? 'Do not exceed more than 24 characters'
                    : ''
                }
              />
            </Mui.ListItem>

            {images.length > 0 ? (
              <Mui.ImageList
                sx={{
                  width: '260px',
                  height: 'auto',
                  marginLeft: '15px',
                }}
                cols={5}
              >
                {images.map((image, index) => (
                  <Mui.ImageListItem key={image}>
                    <Image
                      src={image}
                      alt="category"
                      width="40"
                      height="40"
                      style={{
                        marginRight: '4px',
                        borderRadius: '2px',
                        border: '1px solid rgb(230, 230, 230)',
                      }}
                      priority
                    />
                    <Mui.IconButton
                      variant="contained"
                      // value={index}
                      onClick={() => imageRemoveHandle(index)}
                      color="warning"
                      sx={{
                        position: 'absolute',
                        backgroundColor: '#fff',
                        top: '0',
                        left: '0',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '3px',
                      }}
                    >
                      <CloseIcon fontSize="10px" />
                    </Mui.IconButton>
                  </Mui.ImageListItem>
                ))}
              </Mui.ImageList>
            ) : null}

            <Mui.ListItem>
              <Mui.TextField
                {...register('catImages', {
                  required: {
                    value: images?.length < 1,
                    message: 'Category image is required',
                  },
                  // if images? not present from db
                  // not input any image
                  // image size less than 10mb
                  validate: {
                    lessThan10MB: files =>
                      images?.length > 0 && files.length > 0
                        ? files[0]?.size < 10485760
                        : images?.length < 1 && files.length > 0
                        ? files[0]?.size < 10485760
                        : images?.length > 0 && files.length < 1
                        ? true
                        : 'Max size is 10MB',
                    acceptedFormats: files =>
                      files.length < 1 ||
                      ['image/png', 'image/jpg', 'image/jpeg'].includes(
                        files[0].type
                      ) ||
                      'Accepted formats are png, jpg, & jpeg',
                  },
                })}
                inputProps={{ type: 'file', multiple: true }}
                name="catImages"
                variant="outlined"
                size="small"
                accept="image/jpeg, image/jpg, image/png"
                onChange={changeFileHandle}
                fullWidth
                helperText={errors?.catImages && errors?.catImages.message}
              />
            </Mui.ListItem>
            <Mui.ListItem>
              <Mui.Button type="submit" fullWidth variant="contained">
                Update Category
              </Mui.Button>
            </Mui.ListItem>
          </Mui.List>
        </Mui.Box>
      </Mui.Paper>
    </Layout>
  );
};

export default Edit;
