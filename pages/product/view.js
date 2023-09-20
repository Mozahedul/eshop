import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Mui from '../../components/muiImportComponents/ProductMUI';
import * as MuiIcon from '../../components/muiImportComponents/MUIIcons';
import Layout from '../../components/Layout';
import { useStateValue } from '../../utils/contextAPI/StateProvider';
import { getError } from '../../utils/error';
import ImageFallback from '../../utils/ImageFallback';

const View = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();
  const [products, setProducts] = useState([]);

  console.log('PRODUCTS ==> ', products?.[0]?.images?.[0]);
  // console.log('PRODUCTS ==> ', products);
  const [{ userInfo, loadingProduct, error }, dispatch] = useStateValue();

  const userCookie = Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : '';

  const userToken = userInfo || userCookie;

  // Product remove handler
  const handleProductRemove = async productId => {
    try {
      const { data } = await axios.delete(`/api/products/delete/${productId}`, {
        headers: { authorization: `Bearer ${userToken.token}` },
      });

      if (data && data._id) {
        // remove a single product from state
        const filteredProducts = products?.filter(
          product => product._id !== data._id
        );
        setProducts(filteredProducts);

        toast.error(`The product - ${data.title} - deleted successfully`, {
          position: 'top-center',
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

  // change page for table
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Change rows per page
  const handleChangeRowsPerPage = event => {
    // Here 10 is a radix number that is used to change the string
    // into decimal integer number
    // The syntax of parseInt: parseInt("string", radix number);
    // Radix numbers are binary(2), octal(8), decimal(10), hexadecimal(16)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const isCancelled = useRef(false);
  useEffect(() => {
    // if (!isCancelled.current) {
    if (!userToken) {
      router.push('/login');
    } else {
      const fetchProducts = async () => {
        try {
          dispatch({ type: 'PRODUCT_REQUEST' });
          const { data } = await axios.get('/api/products/view', {
            headers: { authorization: `Bearer ${userToken.token}` },
          });

          console.log('PRODUCTS INSIDE USE EFFECT ==> ', data);
          setProducts(data);
          dispatch({ type: 'PRODUCT_SUCCESS' });
        } catch (err) {
          dispatch({ type: 'PRODUCT_FAIL', error: getError(err) });
          toast.error(err);
        }
      };

      fetchProducts();
    }
    // }
    // return () => {
    //   isCancelled.current = true;
    // };
  }, [userToken, router, dispatch]);
  return (
    <Layout
      title="Product view page"
      description="This is is product view web page"
    >
      <Mui.Typography variant="h1">Product View</Mui.Typography>
      <Mui.Box textAlign="right" marginBottom="30px">
        <Link href="/product/create">
          <Mui.Button variant="contained">Create Product</Mui.Button>
        </Link>
      </Mui.Box>
      {loadingProduct ? (
        <Mui.Box textAlign="center">
          <Mui.CircularProgress size="4rem" />
        </Mui.Box>
      ) : error ? (
        <Mui.Alert severity="error">{error}</Mui.Alert>
      ) : products.length < 1 ? (
        <Mui.Alert severity="warning">No products found</Mui.Alert>
      ) : (
        <Mui.Paper>
          <Mui.TableContainer>
            <Mui.Table>
              <Mui.TableHead>
                <Mui.TableRow>
                  <Mui.TableCell>SL No.</Mui.TableCell>
                  <Mui.TableCell>Title</Mui.TableCell>
                  <Mui.TableCell>Short Description</Mui.TableCell>
                  <Mui.TableCell>Description</Mui.TableCell>
                  <Mui.TableCell>Category</Mui.TableCell>
                  <Mui.TableCell>Images</Mui.TableCell>
                  <Mui.TableCell>Shipping</Mui.TableCell>
                  <Mui.TableCell>Price</Mui.TableCell>
                  <Mui.TableCell>Color</Mui.TableCell>
                  <Mui.TableCell>Brand</Mui.TableCell>
                  <Mui.TableCell>Size</Mui.TableCell>
                  <Mui.TableCell>Reviews</Mui.TableCell>
                  <Mui.TableCell>In Stock</Mui.TableCell>
                  <Mui.TableCell>Sold</Mui.TableCell>
                  <Mui.TableCell>Action</Mui.TableCell>
                </Mui.TableRow>
              </Mui.TableHead>
              <Mui.TableBody>
                {Array.isArray(products) &&
                  products.length &&
                  products
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map(product => (
                      <Mui.TableRow key={product._id}>
                        <Mui.TableCell scope={product._id}>
                          {product?._id?.slice(product._id.length - 4)}
                        </Mui.TableCell>
                        <Mui.TableCell>
                          {product.title.substring(0, 10) + '...'}
                        </Mui.TableCell>
                        <Mui.TableCell>
                          {product.shortDescription.substring(0, 10) + '...'}
                        </Mui.TableCell>
                        <Mui.TableCell>
                          {product.description.substring(0, 10) + '...'}
                        </Mui.TableCell>
                        <Mui.TableCell>
                          {product.categories?.name}
                        </Mui.TableCell>
                        <Mui.TableCell>
                          <ImageFallback
                            src={
                              product.images?.length > 0
                                ? product.images?.[0]
                                : '/placeholder.png'
                            }
                            fallbackSrc="/placeholder.png"
                            alt={product.title}
                            width={40}
                            height={40}
                          />
                        </Mui.TableCell>
                        <Mui.TableCell>{product.shipping}</Mui.TableCell>
                        <Mui.TableCell>${product.price}</Mui.TableCell>
                        <Mui.TableCell>{product.color}</Mui.TableCell>
                        <Mui.TableCell>{product.brand}</Mui.TableCell>
                        <Mui.TableCell>{product.size}</Mui.TableCell>
                        <Mui.TableCell>{product.numReviews}</Mui.TableCell>
                        <Mui.TableCell>{product.countInStock}</Mui.TableCell>
                        <Mui.TableCell>{product.sold}</Mui.TableCell>
                        <Mui.TableCell>
                          <Link href={`/product/edit/${product._id}`}>
                            <Mui.IconButton
                              variant="contained"
                              color="success"
                              size="small"
                            >
                              <MuiIcon.EditIcon />
                            </Mui.IconButton>
                          </Link>
                          <Mui.IconButton
                            onClick={() => handleProductRemove(product._id)}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            <MuiIcon.DeleteIcon />
                          </Mui.IconButton>
                        </Mui.TableCell>
                      </Mui.TableRow>
                    ))}
              </Mui.TableBody>
            </Mui.Table>
          </Mui.TableContainer>
          <Mui.TablePagination
            page={page}
            component="div"
            count={products.length}
            rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Mui.Paper>
      )}
    </Layout>
  );
};

export default View;
