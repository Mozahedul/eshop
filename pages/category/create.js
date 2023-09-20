import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import * as Mui from '../../components/muiImportComponents/CategoryMUI';
import styles from '../../styles/account.module.css';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import { getError } from '../../utils/error';
import { useRef } from 'react';

const Layout = dynamic(() => import('../../components/Layout'));

const Create = () => {
  const [showImage, setShowImage] = useState([]);
  const router = useRouter();
  const [{ userInfo, loadingSubmit, error }, dispatch] = useStateValue();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // user info taken from cookies
  const userInfoCookie = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';

  const userToken = userInfo || userInfoCookie;

  // file change handler
  const handleFileChange = event => {
    const catImages = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const imgUrl = URL.createObjectURL(event.target.files[i]);
      catImages.push(imgUrl);
    }

    if (showImage.length > 0) {
      showImage.length = 0;
    }

    setShowImage([...showImage, ...catImages]);
  };

  const submitCategoryHandle = async categories => {
    const { category, description } = categories;
    const imageFiles = categories.avatar;

    // using formData API to capture HTML form fields
    const formData = new FormData();
    formData.append('category', category);
    formData.append('description', description);

    // for send image files to multer
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('avatar', imageFiles[i]);
    }

    try {
      dispatch({ type: 'REQUEST_CREATE' });
      // send image files to multer
      // get the object of cloudinary from backend
      const { data } = await axios.post(`/api/upload/create`, formData, {
        headers: { authorization: `Bearer ${userToken?.token}` },
      });

      if (data.message) {
        setShowImage([]);
        dispatch({ type: 'REQUEST_SUCCESS' });
        toast.success(data.message, {
          position: 'top-center',
          theme: 'colored',
          autoClose: 1000,
        });

        // After passing 0.5 seconds, redirect to the path
        setTimeout(() => {
          router.push('/category/view');
        }, 500);
      } else {
        dispatch({ type: 'REQUEST_FAIL' });
        toast.error(data.errMessage, {
          position: 'top-center',
          theme: 'colored',
          autoClose: 1000,
        });
      }
    } catch (err) {
      dispatch({ error: getError(err) });
      toast.error(getError(err), {
        position: 'top-center',
        theme: 'colored',
        autoClose: 1000,
      });
      dispatch({ type: 'REQUEST_FAIL' });
    }
  };

  const isCancelled = useRef(false);
  useEffect(() => {
    if (!isCancelled.current) {
      if (!userToken) {
        router.push('/login');
      }
    }
    return () => {
      isCancelled.current = true;
    };
  }, [userToken, router]);

  return (
    <Layout>
      <Mui.Typography variant="h2" sx={{ textAlign: 'center' }}>
        Create Category
      </Mui.Typography>
      {loadingSubmit ? (
        <Mui.Box textAlign="center">
          <Mui.CircularProgress size="2rem" />
          <Mui.Typography variant="subtitle2">
            Please! wait. Image files has been processing.
          </Mui.Typography>
        </Mui.Box>
      ) : error ? (
        <Mui.Alert severity="warning">{error}</Mui.Alert>
      ) : (
        ''
      )}
      <Mui.Paper className={styles.formLogin}>
        <Mui.Box textAlign="right">
          <Link href="/category/view">
            <Mui.Button variant="contained" size="small">
              View Categories
            </Mui.Button>
          </Link>
        </Mui.Box>
        <Mui.Box component="form" onSubmit={handleSubmit(submitCategoryHandle)}>
          <Mui.List>
            <Mui.ListItem>
              <Mui.TextField
                {...register('category', {
                  required: true,
                  minLength: 5,
                  maxLength: 24,
                })}
                inputProps={{ type: 'text' }}
                placeholder="Category Name"
                label="Category Name"
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
                  maxLength: 200,
                })}
                inputProps={{ type: 'text' }}
                placeholder="Description"
                label="Description"
                name="description"
                variant="outlined"
                multiline
                maxRows={4}
                size="small"
                fullWidth
                helperText={
                  errors?.description?.type === 'required'
                    ? 'Description should not be empty'
                    : errors?.description?.type === 'minLength'
                    ? 'Insert at least 5 characters'
                    : errors?.description?.type === 'maxLength'
                    ? 'Do not exceed more than 200 characters'
                    : ''
                }
              />
            </Mui.ListItem>

            {showImage.length > 0 && (
              <Mui.ImageList
                sx={{
                  width: '260px',
                  height: 'auto',
                  marginLeft: '15px',
                }}
                cols={5}
              >
                {showImage.map(image => (
                  <Mui.ImageListItem key={image}>
                    <Image
                      src={image}
                      alt={image}
                      width={40}
                      height={40}
                      style={{
                        marginRight: '4px',
                        borderRadius: '4px',
                        border: '1px solid lightgrey',
                      }}
                    />
                  </Mui.ImageListItem>
                ))}
              </Mui.ImageList>
            )}

            <Mui.ListItem>
              <Mui.TextField
                {...register('avatar', {
                  required: { value: true, message: 'Image is required' },
                  validate: {
                    lessThan10MB: files =>
                      files[0].size < 10485760 || 'Maximum file size size 10MB',
                    acceptedFormats: files =>
                      ['image/png', 'image/jpg', 'image/jpeg'].includes(
                        files[0].type
                      ) || 'Accepted formats are png, jpg, & jpeg',
                  },
                })}
                inputProps={{ type: 'file', multiple: true }}
                name="avatar"
                onChange={handleFileChange}
                fullWidth
                helperText={errors?.avatar && errors?.avatar.message}
              />
            </Mui.ListItem>
            <Mui.ListItem>
              <Mui.Button type="submit" fullWidth variant="contained">
                Create Category
              </Mui.Button>
            </Mui.ListItem>
          </Mui.List>
        </Mui.Box>
      </Mui.Paper>
    </Layout>
  );
};

export default Create;
