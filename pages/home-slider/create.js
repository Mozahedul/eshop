import dynamic from 'next/dynamic';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Mui from '../../components/muiImportComponents/HomeMUI';
import styles from '../../styles/account.module.css';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import { getError } from '../../utils/error';

const Layout = dynamic(() => import('../../components/Layout'));

// console.log('COOKIES ==> ', Cookies);

const Create = () => {
  const [{ userInfo }] = useStateValue();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const tokenStorage = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';

  const userToken = userInfo || tokenStorage;
  // console.log('USER TOKEN CLIENT ==> ', userToken);

  const submitBannerHandler = async banner => {
    const formData = new FormData();

    formData.append('title', banner.title);
    formData.append('subtitle', banner.subtitle);
    formData.append('avatar', banner.avatar[0]);

    // console.log('FORM DATA ==> ', formData);

    try {
      const { data } = await axios.post('/api/home-slider/create', formData, {
        headers: { authorization: `Bearer ${userToken.token}` },
      });

      // console.log('BANNER DATA ==> ', data);
      if (data && 'title' in data) {
        toast.success('Banner added successfully', {
          position: 'top-center',
          theme: 'colored',
          autoClose: 1000,
        });
        router.push('/home-slider/view');
      }
    } catch (err) {
      toast.error(getError(err), {
        position: 'top-center',
        theme: 'colored',
        autoClose: 1000,
      });
    }
  };
  return (
    <Layout>
      <Mui.Typography variant="h1" align="center">
        Home slider create
      </Mui.Typography>
      <Mui.Paper className={styles.formLogin} sx={{ padding: '30px' }}>
        <Mui.Box textAlign="right" marginBottom="15px">
          <Link href="/home-slider/view">
            <Mui.Button variant="contained" size="small" color="success">
              View banners
            </Mui.Button>
          </Link>
        </Mui.Box>
        <Mui.Box
          textAlign="center"
          component="form"
          onSubmit={handleSubmit(submitBannerHandler)}
        >
          <Mui.TextField
            sx={{ marginTop: '15px' }}
            {...register('title', {
              required: true,
              minLength: 10,
              maxLength: 60,
            })}
            name="title"
            fullWidth
            label="Banner Title"
            size="small"
            placeholder="Add banner title"
            inputProps={{ type: 'text' }}
            helperText={
              errors?.title?.type === 'required'
                ? 'Title should not be empty!'
                : errors?.title?.type === 'minLength'
                ? 'Insert at least 10 characters!'
                : errors?.title?.type === 'maxLength'
                ? "Don't exceed 60 characters!"
                : ''
            }
          />
          <Mui.TextField
            sx={{ marginTop: '15px' }}
            {...register('subtitle', {
              required: true,
              minLength: 10,
              maxLength: 100,
            })}
            name="subtitle"
            fullWidth
            label="Banner subtitle"
            size="small"
            placeholder="Add banner subtitle"
            inputProps={{ type: 'text' }}
            helperText={
              errors?.subtitle?.type === 'required'
                ? 'subtitle should not be empty!'
                : errors?.subtitle?.type === 'minLength'
                ? 'Insert at least 10 characters!'
                : errors?.subtitle?.type === 'maxLength'
                ? "Don't exceed 60 characters!"
                : ''
            }
          />

          {/* Image */}
          <Mui.TextField
            sx={{ marginTop: '15px' }}
            fullWidth
            size="small"
            name="avatar"
            inputProps={{ type: 'file' }}
            {...register('avatar', {
              required: { value: true, message: 'Image is required' },
              validate: {
                lessThan10MB: files =>
                  files[0].size < 10000000 || 'Max file size is 10MB',
                acceptedFormats: files =>
                  ['image/png', 'image/jpg', 'image/jpeg'].includes(
                    files[0].type
                  ) || 'Accepted image formats are png, jpg, & jpeg',
              },
            })}
            helperText={errors?.avatar && errors?.avatar.message}
          />

          <Mui.Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: '15px' }}
          >
            Create Banner
          </Mui.Button>
        </Mui.Box>
      </Mui.Paper>
    </Layout>
  );
};

export default Create;
