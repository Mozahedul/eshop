import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Mui from '../../../components/muiImportComponents/SubCategoryMUI';
import Layout from '../../../components/Layout';
import styles from '../../../styles/account.module.css';
import { useStateValue } from '../../../utils/contextAPI/StateProvider';
import { getError } from '../../../utils/error';

const Edit = () => {
  const [images, setImages] = useState([]);
  const [removedSubCatImage, setRemovedSubCatImage] = useState([]);
  const [cats, setCats] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [catId, setCatId] = useState(null);
  console.log('CATEGORY ID OF SUBCATEGORY ==> ', catId);
  // console.log('IMAGES ==> ', images);
  const router = useRouter();
  const [{ userInfo }] = useStateValue();
  const subcategoryId = router.query.id;
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

  // edit category handle function
  const editSubCategoryHandle = async subcategories => {
    const formData = new FormData();

    // console.log('SUBCATEGORIES ==> ', subcategories);

    for (let i = 0; i < subcategories?.subCatImages?.length; i++) {
      formData.append('subCatImages', subcategories.subCatImages[i]);
    }

    try {
      // if (subcategoryId) {
      const { data: subCatImages } = await axios.post(
        '/api/subcategory/edit/image-process',
        formData,
        { headers: { authorization: `Bearer ${userToken.token}` } }
      );

      // console.log('SUBCATEGORY ==> ', subCatImages);

      // replace locally added image with multer processed image
      images.splice(-subCatImages.length, subCatImages.length);
      // combine two array 1. db image 2. multer processed image
      const newSubCategory = [...images, ...subCatImages];
      setImages(newSubCategory);

      const subCatObj = {
        name: subcategories.subcategory,
        parentCategory: catId,
        description: subcategories.description,
        image: newSubCategory,
        removedSubCatImage,
      };

      const { data: updateSubCategory } = await axios.put(
        `/api/subcategory/edit/${subcategoryId}`,
        subCatObj,
        {
          headers: { authorization: `Bearer ${userToken.token}` },
        }
      );

      // console.log('UPDATE SUBCATEGORY ==> ', updateSubCategory);

      if (updateSubCategory && 'name' in updateSubCategory) {
        setImages([]);
        toast.success('SubCategory updated successfully', {
          position: 'top-center',
          theme: 'colored',
          autoClose: 1000,
        });
        setTimeout(() => {
          router.push('/subcategory/view');
        }, 500);
      } else {
        toast.error('SubCategory update failed');
        return true;
      }
      // }
    } catch (err) {
      toast.error(err);
    }
    return true;
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

    setRemovedSubCatImage([...removedSubCatImage, ...slicedImages]);
    setImages(newImages);
  };

  useEffect(() => {
    if (!userToken) {
      router.push('/login');
    } else {
      try {
        const fetchSubCategory = async () => {
          const { data } = await axios.get(
            `/api/subcategory/edit/${subcategoryId}`,
            {
              headers: { authorization: `Bearer ${userToken.token}` },
            }
          );

          // console.log('DATA => ', data);
          setImages(data.image);
          setValue('subcategory', data.name);
          setValue('category', data.parentCategory?.name);
          setSelectedSubCat(
            cats.find(cat => cat._id === data?.parentCategory?._id)
          );
          setCatId(data?.parentCategory?._id);
          setValue('description', data.description);
        };

        if (subcategoryId) {
          fetchSubCategory();
        }
      } catch (error) {
        console.log(getError(error));
      }
    }
  }, [
    userToken,
    subcategoryId,
    router,
    setValue,
    setSelectedSubCat,
    cats,
    setCatId,
  ]);

  // for loading category
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get('/api/category/view', {
        headers: { authorization: `Bearer ${userToken.token}` },
      });
      // console.log('CATEGORY DATA ==> ', data);
      const catArr = [];
      data.map(catData =>
        catArr.push({ label: catData.name, _id: catData._id })
      );
      setCats(catArr);
    };

    fetchCategories();
  }, [userToken]);

  return (
    <Layout>
      <Mui.Typography variant="h2" sx={{ textAlign: 'center' }}>
        Update SubCategory
      </Mui.Typography>

      <Mui.Paper className={styles.formLogin}>
        <Mui.Box align="right">
          <Link href="/subcategory/view">
            <Mui.Button variant="contained" size="small">
              View Subcategories
            </Mui.Button>
          </Link>
        </Mui.Box>
        <Mui.Box
          component="form"
          onSubmit={handleSubmit(editSubCategoryHandle)}
          sx={{ padding: '15px 30px' }}
        >
          <Mui.List>
            <Mui.FormControl fullWidth sx={{ marginBottom: '15px' }}>
              <Mui.FormLabel>Subcategory</Mui.FormLabel>
              <Mui.TextField
                {...register('subcategory', {
                  required: true,
                  minLength: 5,
                  maxLength: 24,
                })}
                inputProps={{ type: 'text' }}
                name="subcategory"
                variant="outlined"
                size="small"
                helperText={
                  errors?.subcategory?.type === 'required'
                    ? 'subcategory should not be empty'
                    : errors?.subcategory?.type === 'minLength'
                    ? 'Insert at least 5 characters'
                    : errors?.subcategory?.type === 'maxLength'
                    ? 'Do not exceed more than 24 characters'
                    : ''
                }
              />
            </Mui.FormControl>
            <Mui.FormControl fullWidth sx={{ marginBottom: '15px' }}>
              <Mui.FormLabel>Category</Mui.FormLabel>
              <Mui.Autocomplete
                options={cats}
                autoHighlight
                getOptionLabel={option => option.label}
                value={selectedSubCat || null}
                defaultValue={selectedSubCat || null}
                isOptionEqualToValue={(option, value) => {
                  if (value === '' || value === option) return true;
                  return true;
                }}
                onChange={(event, newValue) => {
                  setCatId(newValue?._id);
                  setSelectedSubCat(newValue);
                }}
                // getOptionSelected={option => option.label === selectedSubCat}
                renderInput={params => (
                  <Mui.TextField
                    name="category"
                    {...params}
                    {...register('category', { required: true })}
                    helperText={
                      errors?.category?.type === 'required'
                        ? 'Please select at least one category'
                        : null
                    }
                  />
                )}
              />
            </Mui.FormControl>
            <Mui.FormControl fullWidth sx={{ marginBottom: '15px' }}>
              <Mui.FormLabel>Description</Mui.FormLabel>
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
                multiline
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
            </Mui.FormControl>

            {images?.length > 0 ? (
              <Mui.ImageList
                sx={{
                  width: '260px',
                  height: 'auto',
                  marginBottom: '15px',
                }}
                cols={5}
              >
                {images.map((image, index) => (
                  <Mui.ImageListItem key={image}>
                    <Image
                      src={image}
                      alt="subcategory"
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

            <Mui.FormControl fullWidth sx={{ marginBottom: '15px' }}>
              <Mui.FormLabel>Image</Mui.FormLabel>
              <Mui.TextField
                {...register('subCatImages', {
                  required: {
                    value: images?.length < 1,
                    message: 'subcategory image is required',
                  },
                  // if images not present from db
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
                name="subCatImages"
                variant="outlined"
                size="small"
                accept="image/jpeg, image/jpg, image/png"
                onChange={changeFileHandle}
                helperText={errors?.catImages && errors?.catImages.message}
              />
            </Mui.FormControl>
            <Mui.FormControl fullWidth>
              <Mui.Button type="submit" variant="contained">
                Update subcategory
              </Mui.Button>
            </Mui.FormControl>
          </Mui.List>
        </Mui.Box>
      </Mui.Paper>
    </Layout>
  );
};

export default Edit;
