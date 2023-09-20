import dynamic from 'next/dynamic';
import axios from 'axios';
import Cookies from 'js-cookie';
// import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Mui from '../../components/muiImportComponents/HomeMUI';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import { getError } from '../../utils/error';
import ImageFallback from '../../utils/ImageFallback';
import { useRef } from 'react';

const Layout = dynamic(() => import('../../components/Layout'));

const View = () => {
  const [banners, setBanners] = useState([]);
  const [{ userInfo, loadingBanner, error }, dispatch] = useStateValue();

  // console.log('BANNERS ==> ', banners);

  const tokenStorage = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';

  const userToken = userInfo || tokenStorage;

  // Remove banner
  const handleBannerRemove = async bannerId => {
    try {
      const { data } = await axios.delete(
        `/api/home-slider/delete/${bannerId}`,
        {
          headers: { authorization: `Bearer ${userToken.token}` },
        }
      );
      if (data && 'message' in data) {
        const bannerExist = banners.filter(banner => banner._id !== bannerId);
        setBanners(bannerExist);
        toast.error(data.message, {
          position: 'top-center',
          theme: 'colored',
          autoClose: 1000,
        });
      }
    } catch (err) {
      toast.error(err, {
        position: 'top-center',
        theme: 'colored',
        autoClose: 2000,
      });
    }
  };

  const isCancelled = useRef(false);
  useEffect(() => {
    if (!isCancelled.current) {
      const fetchBanners = async () => {
        dispatch({ type: 'BANNER_REQUEST' });
        try {
          const { data } = await axios.get('/api/home-slider/view', {
            headers: { authorization: `Bearer ${userToken.token}` },
          });

          setBanners(data);
          dispatch({ type: 'BANNER_SUCCESS' });
        } catch (err) {
          dispatch({ type: 'BANNER_FAIL', payload: getError(err) });
        }
      };
      fetchBanners();
    }
    return () => {
      isCancelled.current = true;
    };
  }, [userToken, dispatch]);
  return (
    <Layout>
      <Mui.Typography variant="h1">Banner view</Mui.Typography>
      <Mui.Box textAlign="right" marginBottom="15px">
        <Link href="/home-slider/create">
          <Mui.Button variant="contained" color="success" size="small">
            Create Banner
          </Mui.Button>
        </Link>
      </Mui.Box>
      {loadingBanner ? (
        <Mui.Box textAlign="center">
          <Mui.CircularProgress size="4rem" />
        </Mui.Box>
      ) : error ? (
        <Mui.Alert severity="error">{error}</Mui.Alert>
      ) : banners.length < 1 ? (
        <Mui.Alert severity="warning">No Banners found</Mui.Alert>
      ) : (
        <Mui.Paper>
          <Mui.TableContainer>
            <Mui.Table>
              <Mui.TableHead>
                <Mui.TableRow>
                  <Mui.TableCell>SL No.</Mui.TableCell>
                  <Mui.TableCell>Title</Mui.TableCell>
                  <Mui.TableCell>Subtitle</Mui.TableCell>
                  <Mui.TableCell>Image</Mui.TableCell>
                  <Mui.TableCell align="right">Action</Mui.TableCell>
                </Mui.TableRow>
              </Mui.TableHead>
              <Mui.TableBody>
                {banners?.map(banner => (
                  <Mui.TableRow key={banner._id}>
                    <Mui.TableCell>{banner._id.slice(-4)}</Mui.TableCell>
                    <Mui.TableCell>{banner.title}</Mui.TableCell>
                    <Mui.TableCell>{banner.subtitle}</Mui.TableCell>
                    <Mui.TableCell>
                      <ImageFallback
                        src={banner?.image || '/placeholder.png'}
                        fallbackSrc="/placeholder.png"
                        alt={banner.title}
                        width={40}
                        height={40}
                      />
                    </Mui.TableCell>
                    <Mui.TableCell align="right">
                      <Link href={`/home-slider/edit/${banner._id}`}>
                        <Mui.Button size="small" variant="contained">
                          Edit
                        </Mui.Button>
                      </Link>

                      <Mui.Button
                        onClick={() => handleBannerRemove(banner._id)}
                        sx={{ marginLeft: '5px' }}
                        size="small"
                        color="error"
                        variant="contained"
                      >
                        Delete
                      </Mui.Button>
                    </Mui.TableCell>
                  </Mui.TableRow>
                ))}
              </Mui.TableBody>
            </Mui.Table>
          </Mui.TableContainer>
        </Mui.Paper>
      )}
    </Layout>
  );
};

export default View;
