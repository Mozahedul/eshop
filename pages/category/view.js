import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import * as Mui from '../../components/muiImportComponents/CategoryMUI';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import { getError } from '../../utils/error';
import ImageFallback from '../../utils/ImageFallback';

const Layout = dynamic(() => import('../../components/Layout'));

const View = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  console.log('ROW PER PAGE ==> ', rowsPerPage);
  const router = useRouter();
  const [{ userInfo, loadingCategory, error }, dispatch] = useStateValue();
  const [categories, setCategories] = useState([]);

  // get user info from cookies
  const userInfoToken = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';
  const userToken = userInfo || userInfoToken;

  // Remove category function
  const removeCategoryHandle = async catId => {
    try {
      const { data } = await axios.delete(`/api/category/delete/${catId}`, {
        headers: { authorization: `Bearer ${userToken.token}` },
      });

      if (data && data._id) {
        // remove a single category from state
        const filteredCat = categories.filter(
          category => category._id !== data._id
        );
        setCategories(filteredCat);

        toast.error(`The category "${data.name}" deleted successfully`, {
          position: 'top-center',
          theme: 'colored',
          autoClose: 1000,
        });
      }
    } catch (err) {
      toast.error(getError(err), {
        position: 'top-center',
        autoClose: 1000,
        theme: 'colored',
      });
    }
  };

  // page change handler
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // handle rows for per page
  const handleRowsPerPageChange = event => {
    // change the string value into integer with decimal(10)
    setRowsPerPage(event.target.value, 10);
    setPage(0);
  };

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      if (!userToken) {
        router.push('/login');
      } else {
        const fetchCategories = async () => {
          try {
            dispatch({ type: 'CATEGORY_REQUEST' });
            const { data } = await axios.get('/api/category/view', {
              headers: { authorization: `Bearer ${userToken.token}` },
            });
            setCategories(data);
            dispatch({ type: 'CATEGORY_SUCCESS' });
          } catch (err) {
            dispatch({ type: 'CATEGORY_FAIL', payload: getError(err) });
            toast.error(err);
          }
        };
        fetchCategories();
      }
    }
    return () => {
      isCancelled = true;
    };
  }, [dispatch, router, userToken]);

  return (
    <Layout title="Category create page" description="To create a new category">
      <Mui.Typography variant="h2">View Categories</Mui.Typography>
      <Mui.Box textAlign="right" marginBottom="15px">
        <Link href="/category/create">
          <Mui.Button variant="contained">Create Category</Mui.Button>
        </Link>
      </Mui.Box>
      {loadingCategory ? (
        <Mui.Box textAlign="center">
          <Mui.CircularProgress size="4rem" />
        </Mui.Box>
      ) : error ? (
        <Mui.Alert severity="error">{error}</Mui.Alert>
      ) : Array.isArray(categories) && categories.length ? (
        <Mui.Paper>
          <Mui.TableContainer>
            <Mui.Table>
              <Mui.TableHead>
                <Mui.TableRow>
                  <Mui.TableCell>ID</Mui.TableCell>
                  <Mui.TableCell align="right">Name</Mui.TableCell>
                  <Mui.TableCell align="right">Description</Mui.TableCell>
                  <Mui.TableCell align="right">Image</Mui.TableCell>
                  <Mui.TableCell align="right">Action</Mui.TableCell>
                </Mui.TableRow>
              </Mui.TableHead>
              <Mui.TableBody>
                {categories
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(category => (
                    <Mui.TableRow key={category._id}>
                      <Mui.TableCell>
                        {category?._id?.slice(category._id.length - 4)}
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        {category.name}
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        {category.description.substring(0, 50) + '...'}
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        <ImageFallback
                          src={
                            category?.image.length > 0
                              ? category?.image[0]
                              : '/placeholder.png'
                          }
                          fallbackSrc="/placeholder.png"
                          alt="category of next amazon"
                          width="40"
                          height="40"
                        />
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        <Link href={`/category/edit/${category._id}`}>
                          <Mui.Button size="small" variant="contained">
                            Edit
                          </Mui.Button>
                        </Link>
                        <Mui.Button
                          color="warning"
                          size="small"
                          variant="contained"
                          sx={{ marginLeft: '10px' }}
                          onClick={() => removeCategoryHandle(category._id)}
                        >
                          Delete
                        </Mui.Button>
                      </Mui.TableCell>
                    </Mui.TableRow>
                  ))}
              </Mui.TableBody>
            </Mui.Table>
          </Mui.TableContainer>
          <Mui.TablePagination
            // go to page number
            page={page}
            // total number of categories
            count={categories.length}
            // for changing page
            onPageChange={handlePageChange}
            // control rows value (10 then 25, then 50 ...)
            onRowsPerPageChange={handleRowsPerPageChange}
            // rows in per page
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
            component="div"
          />
        </Mui.Paper>
      ) : (
        <Mui.Alert severity="warning">No categories in the list.</Mui.Alert>
      )}
    </Layout>
  );
};

export default View;
