import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Mui from '../../components/muiImportComponents/SubCategoryMUI';
import Layout from '../../components/Layout';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import { getError } from '../../utils/error';
import ImageFallback from '../../utils/ImageFallback';

const View = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // console.log('ROW PER PAGE ==> ', rowsPerPage);
  const router = useRouter();
  const [{ userInfo, loadingSubCategory, error }, dispatch] = useStateValue();
  const [subcategories, setSubCategories] = useState([]);

  // get user info from cookies
  const userInfoToken = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';
  const userToken = userInfo || userInfoToken;

  // Remove category function
  const removeSubCategoryHandle = async subCatId => {
    try {
      const { data } = await axios.delete(
        `/api/subcategory/delete/${subCatId}`,
        {
          headers: { authorization: `Bearer ${userToken.token}` },
        }
      );

      if (data && data._id) {
        // remove a single category from state
        const filteredCat = subcategories.filter(
          subcategory => subcategory._id !== data._id
        );
        setSubCategories(filteredCat);

        toast.error(`The subcategory "${data.name}" deleted successfully`, {
          position: 'top-center',
          theme: 'colored',
          autoClose: 1000,
        });
      } else {
        toast.error('Not succeed! Try again later', {
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

  // const isDiscarded = useRef(false);
  useEffect(() => {
    // if (!isDiscarded.current) {
    if (!userToken) {
      router.push('/login');
    } else {
      const fetchSubCategories = async () => {
        try {
          dispatch({ type: 'SUBCATEGORY_REQUEST' });
          const { data } = await axios.get('/api/subcategory/view', {
            headers: { authorization: `Bearer ${userToken.token}` },
          });
          // if (data !== null) {
          dispatch({ type: 'SUBCATEGORY_SUCCESS' });
          setSubCategories(data);
          // }
        } catch (err) {
          dispatch({ type: 'SUBCATEGORY_FAIL', payload: getError(err) });
          toast.error(err);
        }
      };
      fetchSubCategories();
    }
    // }
    // return () => {
    //   isDiscarded.current = true;
    // };
  }, [dispatch, router, userToken]);
  return (
    <Layout
      title="Category create page"
      description="To create a new subcategory"
    >
      <Mui.Typography variant="h2">View SubCategories</Mui.Typography>
      <Mui.Box textAlign="right" marginBottom="15px">
        <Link href="/subcategory/create">
          <Mui.Button variant="contained">Create SubCategory</Mui.Button>
        </Link>
      </Mui.Box>
      {loadingSubCategory ? (
        <Mui.Box textAlign="center">
          <Mui.CircularProgress size="4rem" />
        </Mui.Box>
      ) : error ? (
        <Mui.Alert severity="error">{error}</Mui.Alert>
      ) : subcategories.length < 1 ? (
        <Mui.Alert severity="warning">No SubCategories in the list.</Mui.Alert>
      ) : (
        <Mui.Paper>
          <Mui.TableContainer>
            <Mui.Table>
              <Mui.TableHead>
                <Mui.TableRow>
                  <Mui.TableCell>ID</Mui.TableCell>
                  <Mui.TableCell align="right">Name</Mui.TableCell>
                  <Mui.TableCell align="right">Category</Mui.TableCell>
                  <Mui.TableCell align="right">Description</Mui.TableCell>
                  <Mui.TableCell align="right">Image</Mui.TableCell>
                  <Mui.TableCell align="right">Action</Mui.TableCell>
                </Mui.TableRow>
              </Mui.TableHead>
              <Mui.TableBody>
                {subcategories
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(subcategory => (
                    <Mui.TableRow key={subcategory._id}>
                      <Mui.TableCell>
                        {subcategory?._id.slice(subcategory._id.length - 4)}
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        {subcategory?.name}
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        {subcategory?.parentCategory?.name}
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        {subcategory.description.substring(0, 50) + '...'}
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        <ImageFallback
                          src={
                            subcategory?.image.length > 0
                              ? subcategory?.image[0]
                              : '/placeholder.png'
                          }
                          fallbackSrc="/placeholder.png"
                          alt="subcategory of next amazon"
                          width="40"
                          height="40"
                        />
                      </Mui.TableCell>
                      <Mui.TableCell align="right">
                        <Link href={`/subcategory/edit/${subcategory._id}`}>
                          <Mui.Button size="small" variant="contained">
                            Edit
                          </Mui.Button>
                        </Link>
                        <Mui.Button
                          color="warning"
                          size="small"
                          variant="contained"
                          sx={{ marginLeft: '10px' }}
                          onClick={() =>
                            removeSubCategoryHandle(subcategory._id)
                          }
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
            count={subcategories.length}
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
      )}
    </Layout>
  );
};

export default View;
