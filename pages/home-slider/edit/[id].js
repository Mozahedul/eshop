import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Mui from '../../../components/muiImportComponents/HomeMUI';
import Layout from '../../../components/Layout';
import styles from '../../../styles/account.module.css';
import { useStateValue } from '../../../utils/contextAPI/StateProvider';
import { getError } from '../../../utils/error';

const Edit = () => {
  const [image, setImage] = useState('');
  // console.log('BANNER IMAGE ==> ', image);
  const router = useRouter();
  const routerId = router.query.id;
  const [{ userInfo }] = useStateValue();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const tokenStg = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';

  const userToken = userInfo || tokenStg;

  const bannerUpdateHandle = async bannerData => {
    const { title, subtitle, avatar } = bannerData;
    const formData = new FormData();

    formData.append('title', title);
    formData.append('subtitle', subtitle);
    if (avatar[0]) {
      formData.append('avatar', avatar[0]);
    }

    try {
      const { data } = await axios.put(
        `/api/home-slider/edit/${routerId}`,
        formData,
        { headers: { authorization: `Bearer ${userToken.token}` } }
      );
      if (data && 'title' in data) {
        setImage(null);
        toast.success('Banner updated successfully', {
          position: 'top-center',
          theme: 'colored',
          autoClose: 1000,
        });

        router.push('/home-slider/view');
      }
      console.log('DATA BANNER SUBMIT ==> ', data);
    } catch (err) {
      toast.error(getError(err), {
        position: 'top-center',
        theme: 'colored',
        autoClose: 2000,
      });
    }
  };

  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    if (!userToken) {
      router.push('/login');
    }
    try {
      const fetchBanner = async () => {
        const { data } = await axios.get(`/api/home-slider/edit/${routerId}`, {
          headers: { authorization: `Bearer ${userToken.token}` },
        });

        setValue('title', data.title);
        setValue('subtitle', data.subtitle);
        setImage(data.image);
        // console.log('BANNER DATA ==> ', data);
      };

      fetchBanner();
    } catch (error) {
      console.log(error);
    }
    // }

    // return () => {
    //   isCancelled.current = true;
    // };
  }, [routerId, userToken, router, setValue]);
  return (
    <Layout>
      <Mui.Typography align="center" variant="h1">
        Edit banner
      </Mui.Typography>
      <Mui.Paper className={styles.formLogin} sx={{ padding: '30px' }}>
        <Mui.Box align="right">
          <Link href="/home-slider/view">
            <Mui.Button variant="contained" color="success" size="small">
              View Banner
            </Mui.Button>
          </Link>
        </Mui.Box>
        <Mui.Box component="form" onSubmit={handleSubmit(bannerUpdateHandle)}>
          <Mui.FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <Mui.FormLabel>Title</Mui.FormLabel>
            <Mui.TextField
              inputProps={{ type: 'text' }}
              size="small"
              {...register('title', {
                required: true,
                minLength: 10,
                maxLength: 60,
              })}
              helperText={
                errors?.title?.type === 'required'
                  ? 'Title is required'
                  : errors?.title?.type === 'minLength'
                  ? 'Insert at least 10 characters'
                  : errors?.title?.type === 'maxLength'
                  ? "Don't Exceed max characters"
                  : null
              }
            />
          </Mui.FormControl>

          <Mui.FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <Mui.FormLabel>Subtitle</Mui.FormLabel>
            <Mui.TextField
              inputProps={{ type: 'text' }}
              size="small"
              {...register('subtitle', {
                required: true,
                minLength: 10,
                maxLength: 60,
              })}
              helperText={
                errors?.subtitle?.type === 'required'
                  ? 'subtitle is required'
                  : errors?.subtitle?.type === 'minLength'
                  ? 'Insert at least 10 characters'
                  : errors?.subtitle?.type === 'maxLength'
                  ? "Don't Exceed max characters"
                  : null
              }
            />
          </Mui.FormControl>

          {image ? (
            <Mui.FormControl sx={{ marginBottom: '15px' }}>
              <Image src={image} alt={image} width="50" height="50" />
            </Mui.FormControl>
          ) : null}

          <Mui.FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <Mui.FormLabel>Image</Mui.FormLabel>
            <Mui.TextField
              inputProps={{ type: 'file' }}
              size="small"
              {...register('avatar', {
                required: {
                  value: image?.length < 1,
                  message: 'Image is required',
                },
                validate: {
                  lessThan10MB: files =>
                    !files[0] ||
                    files[0]?.size < 10485760 ||
                    'Image should be less than 10MB',
                  acceptedFormats: files =>
                    !files[0] ||
                    ['image/png', 'image/jpg', 'image/jpeg'].includes(
                      files[0]?.type
                    ) ||
                    'Only png, jpg, & jpeg are allowed',
                },
              })}
              helperText={errors?.avatar && errors?.avatar.message}
            />
          </Mui.FormControl>
          <Mui.FormControl fullWidth>
            <Mui.Button
              type="submit"
              fullWidth
              variant="contained"
              color="warning"
            >
              Update banner
            </Mui.Button>
          </Mui.FormControl>
        </Mui.Box>
      </Mui.Paper>
    </Layout>
  );
};

export default Edit;
